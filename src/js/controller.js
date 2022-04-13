import * as model from './model.js';

// Parcel을 통해 icons 파일을 불러온다.
// Parcel 1이라면 절대 경로를 그대로 쓰지만, Parcel 2부터는 'url:'을 앞에 붙여 쓴다.
// Parcel은 해당 경로를 번들링된 (dist 폴더에 생성되는) 파일의 경로로 바꾸어 주는 역할.
import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// 로딩 스피너...개충격...
const renderSpinner = function (parentEl) {
  console.log('ok');

  const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    // id가 주어지지 않을 경우를 위한 guard.
    if (!id) return;

    // 로딩 스피너 먼저 렌더링.
    renderSpinner(recipeContainer);

    // 1. Loading Recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2. Rendering Recipe
    // recipe 마크업에 사용될 html을 작성한다(이 부분에서 너무 놀랐고, 신기했음).
    // html은 일반 텍스트, 즉 문자열로 markup 변수에 저장된다.
    // 마크업 변수는 자바스크립트 파일 안에 있으므로, 자바스크립트의 문법이 모두 허용된다.
    const markup = `
      <figure class="recipe__fig">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${recipe.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            recipe.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            recipe.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round">
          <svg class="">
            <use href="${icons}#icon-bookmark-fill"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${recipe.ingredients
            .map(ing => {
              return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ing.quantity}</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit}</span>
                  ${ing.description}
                </div>
              </li>
            `;
            })
            .join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            recipe.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${recipe.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;

    // 마크업을 렌더링 하기 전에 마크업이 렌더링될 엘레먼트 내의 마크업을 초기화 한다.
    // (이때 로딩 스피너도 마크업에서 사라진다)
    recipeContainer.innerHTML = '';
    // 새로운 마크업을 주입한다.
    recipeContainer.insertAdjacentHTML('afterbegin', markup);
  } catch (error) {
    alert(error);
  }
};

// 전역(window)에 'hashchane' 이벤트가 발생할 때, showRecipe를 실행.
// window.addEventListener('hashchange', showRecipe);
// 오로지 hash에 변경이 있을 때에만 showRecipe가 실행되므로,
// hash의 변경 없이 page가 로드될 때에도 실행되도록 load 이벤트 핸들러를 추가.
// (일반적으로 hash의 변경 없이 page가 로드 되는 때란, url을 복사해 새로운 탭에서 붙여넣기 할 때.)
// window.addEventListener('load', showRecipe);

// 여러 이벤트를 하나의 핸들러로 묶기.
['hashchange', 'load'].forEach(ev => addEventListener(ev, showRecipe));
