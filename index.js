// import dotenv from './node_modules/dotenv';
const submitBtn = document.getElementById('viewRepos');
const formBody = document.querySelector('.formBody');
const profileBody = document.querySelector('.profileBody');
const repoContainer = document.querySelector('.repoContainer');
const loginContainer = document.querySelector('.loginContainer');
const login = document.querySelector('#username');
const smallAvatar = document.querySelector('.avatarSmall');
const repoNumber = document.querySelector('.repoNumber');
const repoNumber2 = document.querySelector('.repoNumber2');
const repoList = document.querySelector('.repoList');
const apiKey = '';

const getUser = async () => {
  const loginName = login.value;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: `
                query{
                    
    user(login:"${loginName}"){
        avatarUrl
        name
        login
        bio
        status{
            emoji
        }
        repositories(first:20){
          totalCount
            nodes{
                name
                primaryLanguage{
                    name
                }
                description
                forkCount
                updatedAt
                stargazerCount
                url
                databaseId
                id
                
                
            }
        }
    
}
                }
                `,
        variables: {},
      }),
    });
    const data = await res.json();
    if (data.data == '') {
      return 'The user does not exist';
    } else {
      return data.data;
    }
  } catch (err) {
    console.log(err.message);
  }
};

const addStar = async (repoId) => {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: `
            mutation{
                addStar(input: {starrableId:"${repoId}"}){
            starrable{
                stargazerCount
            }
        }
            }
                `,
      variables: {},
    }),
  });
};

const printUserData = async () => {
  const data = await getUser();

  const { avatarUrl, name, login, bio } = data.user;
  // if (avatarUrl) {
  //   const avatar = avatarUrl;
  // } else {
  //   const avatar = './public/images/avatar,jpg';
  // }
  smallAvatar.src = avatarUrl;
  const html = `<img id="avatar" src=${avatarUrl} alt="Avatar"/>
        <span id="name">${name ? name : ''}</span>
        <span id="loginName">${login}</span>
        <p id="bio">${bio}</p>`;

  profileBody.insertAdjacentHTML('afterbegin', html);
  printRepos();
  repoContainer.style.display = 'block';
};

const printRepos = async () => {
  const repos = await getUser();
  const reposList = repos.user.repositories.nodes;
  const repoCount = repos.user.repositories.totalCount;
  repoNumber.innerHTML = repoCount;
  repoNumber2.innerHTML = repoCount;

  reposList.forEach((repo) => {
    const {
      name,
      description,
      id,
      forkCount,
      primaryLanguage,
      stargazerCount,
      updatedAt,
      url,
    } = repo;

    const primaryLang = primaryLanguage ? primaryLanguage.name : '';
    let langIcon;

    if (primaryLang !== '') {
      switch (primaryLang) {
        case 'JavaScript':
          langIcon = './public/images/jsdot.svg';
          break;
        case 'HTML':
          langIcon = './public/images/htmldot.svg';
          break;
        case 'CSS':
          langIcon = './public/images/cssdot.svg';
          break;
        default:
          langIcon = './public/images/ts.svg';
      }
    } else langIcon = './public/images/blank.svg';

    const html = `<div class="repo">
          <div class="repoInfo">
<a class="repoName" href=${url}>${name}</a>
<p>${description ? description : ''}</p>
          <ul>
            <li>
              <img src=${langIcon} alt="">
              ${primaryLang}</li>
            <li>
              <img src="public/images/star.svg" />
              ${stargazerCount}</li>
            <li>
              <img src="./public/images/fork.svg" alt="">
              ${forkCount}</li>
            <li>Updated on ${updatedAt}</li>
          </ul>
          </div>
          
          <button class="starBtn" id=${id}>
            <img src="public/images/star.svg" style="margin-right: 3px;"/>
            Star</button>
        </div>`;

    repoList.insertAdjacentHTML('beforeend', html);
  });

  const starBtn = document.querySelectorAll('.starBtn');

  starBtn.forEach((button) => {
    button.addEventListener('click', (e) => {
      const id = button.id;
      console.log(id);
      addStar(id);
    });
  });
};

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('It clicked');
  loginContainer.style.display = 'none';
  printUserData();
});

// formBody.addEventListener('click', (e) => {
//   e.preventDefault();
//   console.log('It clicked');
//   loginContainer.style.display = 'none';
//   repoContainer.style.display = 'block';
//   // getUser();
// });

// printRepos();
