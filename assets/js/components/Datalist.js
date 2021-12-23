import { capitalizeFirstLetter, sortAlphabetically } from "../utils/helpers/format.helpers.js"
import { isInArray } from "../utils/helpers/validation.helpers.js"
import recipes from "../utils/provider/recipes.js"

class DataList {
  constructor(el) {
    this.el = el
    this.type = el.getAttribute("data-type")

    this.list = []

    this.opened = false
    this.expanded = false

    this.init()
  }

  init = async () => {
    this.data = await this.getData()
    this.list = await this.displayData()

    this.bindEvents()
  }

  bindEvents = () => {
    const input = this.el.querySelector("input")
    const expand = this.el.querySelector('[data-action="expand"]')
    const listElements = this.el.querySelectorAll("li")

    this.el.addEventListener("search", this.toggleSearch)

    input.addEventListener("input", this.searchData)

    expand.addEventListener("click", this.toggleExpand)

    listElements.forEach((li) => li.addEventListener("click", this.selectListElement))

    document.addEventListener("click", this.handleClick)
  }

  /*
   * Get the data of the recipes linked to the type of the datalist
   */
  getData = () => {
    return new Promise((resolve) => {
      let data = []

      recipes.map((r) => {
        const val = r[this.type]

        Array.isArray(val)
          ? val.map((v) => {
              this.type === "ingredients" && (v = v.ingredient)
              !isInArray(data, v) && data.push(capitalizeFirstLetter(v))
            })
          : !isInArray(data, val) && data.push(capitalizeFirstLetter(val))
      })

      resolve(sortAlphabetically(data))
    })
  }

  /*
   * Display the data into the component's DOM
   */
  displayData = () => {
    return new Promise((resolve) => {
      const wrapper = this.el.querySelector("ul")

      this.data.map((d) => (wrapper.innerHTML += `<li>${d}</li>`))

      resolve(wrapper.querySelectorAll("li"))
    })
  }

  /*
   * Hide non-research data
   */
  searchData = (e) => {
    const val = e.target.value.toLowerCase()
    const hiddenElements = this.el.querySelectorAll("li.hidden")

    hiddenElements.forEach((el) => el.classList.remove("hidden"))

    if (val.length < 3) return this.toggleOpen(false)

    this.list.forEach((el) => !el.textContent.toLowerCase().includes(val) && el.classList.add("hidden"))

    this.el.dispatchEvent(new Event("search"))
  }

  /*
   * Toggle list expansion state
   */
  toggleExpand = () => {
    this.el.classList.toggle("expanded")
    this.expanded = !this.expanded

    this.expanded && this.el.dispatchEvent(new Event("expand"))
  }

  /*
   * Toggles the state of opening the list
   */
  toggleOpen = (state = true) => {
    const func = state ? "add" : "remove"

    this.el.classList[func]("opened")
    this.opened = !this.opened
  }

  /*
   * Toggles the state of opening the list based on search results
   */
  toggleSearch = () => {
    const hiddenElements = this.el.querySelectorAll("li.hidden")

    hiddenElements.length < this.list.length && hiddenElements.length != 0 ? this.toggleOpen() : this.toggleOpen(false)
  }

  /*
   * Handles the click when the list is open or extended
   */
  handleClick = (e) => {
    if ((!this.opened && !this.expanded) || this.el.contains(e.target)) return

    this.opened && this.toggleOpen(false)
    this.expanded && this.toggleExpand()
  }

  /*
   * Dispatch an event for the creation of a tag
   */
  selectListElement = (e) => {
    const event = new Event("tag")
    event["tagType"] = this.type

    e.target.dispatchEvent(event)
  }
}

export default DataList
