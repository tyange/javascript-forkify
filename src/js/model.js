import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

// Model은 state, HTTP Request 등 백엔드(서버)와 상호작용하는 파트로 구성한다.
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      serving: recipe.serving,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (error) {
    console.error(`${error}`);
    throw error;
  }
};

export const loadSearchResult = async function (query) {
  console.log('hi');
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });

    console.log(state.search.results);
  } catch (error) {
    console.error(`${error}`);
    throw error;
  }
};
