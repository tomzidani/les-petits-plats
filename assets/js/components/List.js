import { tronque } from "../utils/helpers/format.helpers.js"
import { isEmpty, isPartiallyInArrayObject, isPartiallyInArray } from "../utils/helpers/validation.helpers.js"
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
   * Refreshes the search based on tags and the main field
   */
  handleSearch = async (e) => {
    const val = e ? e.target.value.toLowerCase() : this.query.toLowerCase()

    this.resetRecipes()

    this.query = val

    if (val.length < 3 && isEmpty(this.tags)) return

    // Query search
    this.currentRecipes =
      val.length >= 3
        ? this.currentRecipes.filter(
            (r) =>
              r.name.toLowerCase().includes(val) ||
              r.description.toLowerCase().includes(val) ||
              isPartiallyInArrayObject(r.ingredients, val, "ingredient")
          )
        : this.recipes

    // Tags search
    this.tags.map((t) => {
      const tVal = t.name.toLowerCase()
      const tType = t.type

      this.currentRecipes = this.currentRecipes.filter((r) => {
        const rVal = r[tType]

        return Array.isArray(rVal)
          ? typeof rVal === "object"
            ? isPartiallyInArrayObject(rVal, tVal, "ingredient")
            : isPartiallyInArray(rVal, tVal)
          : rVal.toLowerCase().includes(tVal)
      })
    })

    this.updateDatalists()

    this.nodeRecipes = await this.displayRecipes()
  }

  /*
   * Add the tag and refresh the search
   */
  addTag = (tag) => {
    this.tags.push(tag)

    this.handleSearch()
  }

  /*
   * Remove the tag and refresh the search
   */
  removeTag = (e) => {
    this.tags = this.tags.filter((t) => t.listEl !== e.target)

    this.handleSearch()
  }

  /*
   * Updates DOM results with current recipes
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
   * Reset recipes and refreshes display
   */
  resetRecipes = async () => {
    this.currentRecipes = this.recipes
    this.nodeRecipes = await this.displayRecipes()

    const listElements = document.querySelectorAll(".datalist__list > ul > li")
    listElements.forEach((l) => l.classList.remove("hidden"))
  }

  /*
   * Displays a not found message
   */
  displayNotFoundMessage = () => {
    return new Promise((resolve) => {
      let messageEl = `<div class="search__notfound"><div class="notfound__wrapper">`
      messageEl += `<div class="notfound__header"><h2 class="notfound__title">Aucune recette ne correspond à vos critères..</h2></div>`
      messageEl += `<div class="notfound__body"><p class="notfound__text">Vous pouvez chercher "tarte aux pommes", "poisson", etc.</p>`
      messageEl += `</div></div></div>`

      this.el.innerHTML = messageEl
    })
  }

  /*
   * Dispatch an event to update the content of datalists.
   */
  updateDatalists = () => {
    const e = new Event("updatelist")
    e.updatedRecipes = this.currentRecipes

    this.el.dispatchEvent(e)
  }
}

export default List
