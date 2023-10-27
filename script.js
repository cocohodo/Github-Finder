//토큰값
//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
const searchInput = document.querySelector('.Search-Input');

//Octokit import 및 토큰 설정
import { Octokit, App } from "https://esm.sh/octokit";
const octokit = new Octokit({
    auth: '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'
  }
)

//아이디 매개변수로 객체 받아와서 반환
async function getUsers(user) {
    const profileResponse = await fetch(`https://api.github.com/users/${user}`);
    const repoResponse = await fetch(`https://api.github.com/users/${user}/repos`);
    const profile = await profileResponse.json();
    const repos = await repoResponse.json();
    return {
        profile: profile,
        repos: repos,
    };
}

//아이디 입력되면 아이디 정보 가져오기
searchInput.addEventListener('change', () => {
    let userName = searchInput.value;
    let loading = document.querySelector('.Spinner-Container');
    loading.style.display = 'block';
    getUsers(userName).then((data)=> {
        if (data.profile.message === 'Not Found') {
            //아이디 없다고 표시
            clearUserInfo();
            //레포 리스트 제거
            let list = document.querySelector('.Repos-List');
            list.replaceChildren();
            //잔디밭 제거
            let contribution = document.querySelector('.User-Contributions');
            contribution.replaceChildren();
            //로딩창 제거
            loading.style.display = 'none';
        }
        else {
            //레포 리스트 제거
            let list = document.querySelector('.Repos-List');
            list.replaceChildren();
            //잔디밭 제거
            let contribution = document.querySelector('.User-Contributions');
            contribution.replaceChildren();
            //프로필 표시
            updateUserInfo(data.profile);
            //레포 표시
            for(let li of data.repos) {
                updateUserRepos(li);
            }
            //잔디밭 contributions 표시
            updateContributions(userName);
            //로딩창 제거
            loading.style.display = 'none';
        }
    })
})

// 유저 정보 업데이트하기
function updateUserInfo(user) {
    //유저 프로필 변경
    const userProfileImage = document.querySelector('.User-Profile-Image');
    userProfileImage.src = user.avatar_url;
    const profileButton = document.querySelector('.User-Profile-Button');
    profileButton.href = user.html_url;
    profileButton.target = '_blank';

    //유저 상태 헤더 변경
    const repos = document.querySelector('.User-Status-Header-Repos');
    const gists = document.querySelector('.User-Status-Header-Gists');
    const followers = document.querySelector('.User-Status-Header-Followers');
    const following = document.querySelector('.User-Status-Header-Following');
    repos.innerHTML = 'Public Repos: ' + user.public_repos;
    gists.innerHTML = 'Public Gists: ' + user.public_gists;
    followers.innerHTML = 'Followers: ' + user.followers;
    following.innerHTML = 'Followers: ' + user.following;

    //유저 상태 세부항목들 변경
    const company = document.querySelector('.User-Status-Details-Company');
    const website = document.querySelector('.User-Status-Details-Website');
    const location = document.querySelector('.User-Status-Details-Location');
    const since = document.querySelector('.User-Status-Details-Since');
    company.innerHTML = 'Company: '+ user.company;
    website.innerHTML = 'Website/Blog: '+ user.website;
    location.innerHTML = 'Location: '+ user.location;
    since.innerHTML = 'Member Since: '+ user.created_at;
}

//검색 결과 없을 시 프로필 정보 초기화
function clearUserInfo() {
    //유저 프로필 변경
    const userProfileImage = document.querySelector('.User-Profile-Image');
    userProfileImage.src = 'blank-profile.png';
    const profileButton = document.querySelector('.User-Profile-Button');
    profileButton.href = 'index.html';

    //유저 상태 헤더 변경
    const repos = document.querySelector('.User-Status-Header-Repos');
    const gists = document.querySelector('.User-Status-Header-Gists');
    const followers = document.querySelector('.User-Status-Header-Followers');
    const following = document.querySelector('.User-Status-Header-Following');
    repos.innerHTML = 'Public Repos: ';
    gists.innerHTML = 'Public Gists: ';
    followers.innerHTML = 'Followers: ';
    following.innerHTML = 'Followers: ';

    //유저 상태 세부항목들 변경
    const company = document.querySelector('.User-Status-Details-Company');
    const website = document.querySelector('.User-Status-Details-Website');
    const location = document.querySelector('.User-Status-Details-Location');
    const since = document.querySelector('.User-Status-Details-Since');
    company.innerHTML = 'Company: ';
    website.innerHTML = 'Website/Blog: ';
    location.innerHTML = 'Location: ';
    since.innerHTML = 'Member Since: ';
}

//레포지토리 업데이트
function updateUserRepos(repo) {
    //레포 컨테이너 생성
    const repoElement = document.createElement('div');
    repoElement.classList.add('Repo');

    const repoLink = document.createElement('a');
    repoLink.classList.add('Repo-Link');
    repoLink.href = repo.html_url;
    repoLink.target = '_blank';

    const repoName = document.createElement('div');
    repoName.classList.add('Repo-Name');
    repoName.innerText = repo.name;

    const repoStatus = document.createElement('div');
    repoStatus.classList.add('Repo-Status');

    const repoStars = document.createElement('div');
    repoStars.classList.add('Repo-Stars');
    repoStars.innerText = 'Stars: '+ repo.stargazers_count;
    const repoWatchers = document.createElement('div');
    repoWatchers.classList.add('Repo-Watchers');
    repoWatchers.innerText = 'Watchers: '+ repo.watchers_count;
    const repoForks = document.createElement('div');
    repoForks.classList.add('Repo-Forks');
    repoForks.innerText = 'Forks: '+ repo.forks_count;

    //레포 왼쪽 a 안에 텍스트 추가
    repoLink.append(repoName);

    //레포 오른쪽 div에 3가지 상태 추가
    repoStatus.append(repoStars);
    repoStatus.append(repoWatchers);
    repoStatus.append(repoForks);

    //레포 컨테이너에 양쪽 div 추가
    repoElement.append(repoLink);
    repoElement.append(repoStatus);

    const list = document.querySelector('.Repos-List');
    list.append(repoElement);
}

//잔디밭 추가
function updateContributions(name) {
    const contributions = document.querySelector('.User-Contributions');
    const contributionsImage = document.createElement('img');
    contributionsImage.classList.add('User-Contributions-Image');
    contributionsImage.src = 'https://ghchart.rshah.org/219138/' + name;
    const contributionsCompareContainer = document.createElement('div');
    contributionsCompareContainer.classList.add('User-Contributions-Compare-Container');
    const contributionsCompareButton = document.createElement('div');
    contributionsCompareButton.classList.add('User-Contributions-Compare-Button');
    contributionsCompareButton.innerText = 'Compare Grassplot';
    const contributionsCompareInput = document.createElement('input');
    contributionsCompareInput.classList.add('User-Contributions-Compare-Input');

    contributionsCompareContainer.append(contributionsCompareInput);
    contributionsCompareContainer.append(contributionsCompareButton);

    contributions.append(contributionsImage);
    contributions.append(contributionsCompareContainer);

    contributionsCompareButton.addEventListener('click', () => {
        const name = contributionsCompareInput.value;
        const compareCheck = document.querySelector('.User-Contributions-Compare-Image');
        if (compareCheck === null) {
            const compareImage = document.createElement('img');
            compareImage.classList.add('User-Contributions-Compare-Image');
            compareImage.src = 'https://ghchart.rshah.org/4582ec/' + name;
            contributions.append(compareImage);
        }
        else {
            compareCheck.src = 'https://ghchart.rshah.org/4582ec/' + name;
        }
    })
    contributionsCompareInput.addEventListener('change', () => {
        const name = contributionsCompareInput.value;
        const compareCheck = document.querySelector('.User-Contributions-Compare-Image');
        if (compareCheck === null) {
            const compareImage = document.createElement('img');
            compareImage.classList.add('User-Contributions-Compare-Image');
            compareImage.src = 'https://ghchart.rshah.org/4582ec/' + name;
            contributions.append(compareImage);
        }
        else {
            compareCheck.src = 'https://ghchart.rshah.org/4582ec/' + name;
        }
    })
}


