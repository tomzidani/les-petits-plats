import { tronque } from "../utils/helpers/format.helpers.js"
import { isInArray, isInArrayObject } from "../utils/helpers/validation.helpers.js"
import recipes from "../utils/provider/recipes.js"

class List {
  constructor() {
    this.el = document.querySelector('[data-component="list"]')
    this.recipes = recipes
    this.currentRecipes = this.recipes
    this.nodeRecipes = []

    this.init()
  }

  init = async () => {
    this.nodeRecipes = await this.displayRecipes()

    this.bindEvents()
  }

  bindEvents = () => {
    const input = document.querySelector("input#q")

    input.addEventListener("input", this.handleSearch)
  }

  /*
   *
   */
  handleSearch = (e) => {
    const val = e.target.value.toLowerCase()

    this.resetRecipes()

    if (val.length < 3) return

    this.currentRecipes = this.recipes.filter(
      (r) => r.name.toLowerCase().includes(val) || r.description.toLowerCase().includes(val) || isInArrayObject(r.ingredients, val, "ingredient")
    )

    this.displayRecipes()
  }

  /*
   *
   */
  displayRecipes = () => {
    return new Promise((resolve) => {
      this.el.innerHTML = ""

      this.currentRecipes.map((r) => {
        let recipeEl = `<article class="recipe-card"><div class="card__wrapper">`
        recipeEl += `<div class="card__media"></div>`
        recipeEl += `<div class="card__infos"><div class="card__header">`
        recipeEl += `<h2 class="card__title">${r.name}</h2><div class="card__time">${r.time} min</div>`
        recipeEl += `</div><div class="card__body">`
        recipeEl += `<div class="card__details"><ul>`

        r.ingredients.map((i) => (recipeEl += `<li><b>${i.ingredient}:</b> ${i.quantity ? i.quantity : ""} ${i.unit ? i.unit : ""}</li>`))

        recipeEl += `</ul></div><div class="card__description">${tronque(r.description)}</div>`
        recipeEl += `</div></div></article>`

        this.el.innerHTML += recipeEl

        resolve(this.el.querySelectorAll("article"))
      })
    })
  }

  resetRecipes = async () => {
    this.currentRecipes = recipes
    await this.displayRecipes()
  }
}

export default List
