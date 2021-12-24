import { tronque } from "../utils/helpers/format.helpers.js"
import { isEmpty, isInArray, isInArrayObject } from "../utils/helpers/validation.helpers.js"
import recipes from "../utils/provider/recipes.js"

class List {
  constructor() {
    this.el = document.querySelector('[data-component="list"]')
    this.recipes = recipes
    this.currentRecipes = this.recipes
    this.nodeRecipes = []

    this.query = document.querySelector("input#q").value
    this.tags = []

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
  handleSearch = async (e) => {
    const val = e ? e.target.value.toLowerCase() : this.query.toLowerCase()

    this.resetRecipes()

    this.query = val

    if (val.length < 3 && !this.tags.length) return

    this.currentRecipes = this.currentRecipes.filter(
      (r) => r.name.toLowerCase().includes(val) || r.description.toLowerCase().includes(val) || isInArrayObject(r.ingredients, val, "ingredient")
    )

    this.tags.map((t) => {
      const tVal = t.name.toLowerCase()
      const tType = t.type

      this.currentRecipes = this.currentRecipes.filter((r) =>
        Array.isArray(r[tType]) ? isInArray(r[tType], tVal) || isInArrayObject(r[tType], tVal, "ingredient") : r[tType].toLowerCase().includes(tVal)
      )
    })

    this.nodeRecipes = await this.displayRecipes()
  }

  /*
   *
   */
  addTag = (tag) => {
    this.tags.push(tag)

    this.handleSearch()
  }

  /*
   *
   */
  removeTag = (e) => {
    this.tags = this.tags.filter((t) => t.listEl !== e.target)

    this.handleSearch()
  }

  /*
   *
   */
  displayRecipes = () => {
    return new Promise((resolve) => {
      if (isEmpty(this.currentRecipes)) return resolve(this.displayNotFoundMessage() && [])

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

  /*
   *
   */
  resetRecipes = async () => {
    this.currentRecipes = this.recipes

    this.nodeRecipes = await this.displayRecipes()
  }

  /*
   *
   */
  displayNotFoundMessage = () => {
    return new Promise((resolve) => {
      let messageEl = `<div class="search__notfound"><div class="notfound__wrapper">`
      messageEl += `<div class="notfound__header"><h2 class="notfound__title">Aucune recette ne correspond à votre critère..</h2></div>`
      messageEl += `<div class="notfound__body"><p class="notfound__text">Vous pouvez chercher "tarte aux pommes", "poisson", etc.</p>`
      messageEl += `</div></div></div>`

      this.el.innerHTML = messageEl
    })
  }
}

export default List
