import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    // id가 주어지지 않을 경우를 위한 guard.
    if (!id) return;

    // 로딩 스피너 먼저 렌더링.
    recipeView.renderSpinner();

    // 1. Loading Recipe
    await model.loadRecipe(id);

    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    alert(error);
  }
};

// 전역(window)에 'hashchange' 이벤트가 발생할 때, showRecipe를 실행.
// window.addEventListener('hashchange', showRecipe);
// 오로지 hash에 변경이 있을 때에만 showRecipe가 실행되므로,
// hash의 변경 없이 page가 로드될 때에도 실행되도록 load 이벤트 핸들러를 추가.
// (일반적으로 hash의 변경 없이 page가 로드 되는 때란, url을 복사해 새로운 탭에서 붙여넣기 할 때.)
// window.addEventListener('load', showRecipe);

// 여러 이벤트를 하나의 핸들러로 묶기.
['hashchange', 'load'].forEach(ev => addEventListener(ev, controlRecipe));
