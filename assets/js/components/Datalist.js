import { capitalizeFirstLetter, sortAlphabetically } from "../utils/helpers/format.helpers.js"
import { isInArray } from "../utils/helpers/validation.helpers.js"
import recipes from "../utils/provider/recipes.js"

class Datalist {
  constructor(el) {
    this.el = el
    this.type = el.getAttribute("data-type")

    this.data
    this.list

    this.opened = false
    this.expanded = false

    this.init()
  }

  init = async () => {
    this.data = await this.get()
    this.list = await this.display()

    this.bindEvents()
  }

  bindEvents = () => {
    const input = this.el.querySelector("input")
    const expand = this.el.querySelector('[data-action="expand"]')
    const li = this.el.querySelectorAll("li")

    li.forEach((l) => l.addEventListener("click", console.log))

    input.addEventListener("input", this.search)
    input.addEventListener("focus", this.focus)

    expand.addEventListener("click", this.expand)

    this.el.addEventListener("search", this.toggleSearch)

    document.addEventListener("click", this.handleClick)
  }

  /*
   * Get data related to the type of datalist based on recipes
   */
  get = () => {
    return new Promise((resolve) => {
      let datas = []

      recipes.map((r) => {
        let data = r[this.type]

        Array.isArray(data)
          ? data.map((d) =>
              this.type === "ingredients"
                ? !isInArray(datas, d.ingredient) && datas.push(capitalizeFirstLetter(d.ingredient))
                : !isInArray(datas, d) && datas.push(capitalizeFirstLetter(d))
            )
          : !isInArray(datas, data) && datas.push(capitalizeFirstLetter(data))
      })

      resolve(sortAlphabetically(datas))
    })
  }

  /*
   * Inserts data into the DOM
   */
  display = () => {
    return new Promise((resolve) => {
      const wrapper = this.el.querySelector("ul")

      this.data.map((d) => (wrapper.innerHTML += `<li tabindex="0">${d}</li>`))

      resolve(wrapper.querySelectorAll("li"))
    })
  }

  /*
   * Displays the DOM elements containing the sought value
   */
  search = (e) => {
    const val = e.target.value.toLowerCase()
    const displayedLi = this.el.querySelectorAll("li.displayed")

    displayedLi.forEach((l) => l.classList.remove("displayed"))

    val && this.list.forEach((l) => l.textContent.toLowerCase().includes(val) && l.classList.add("displayed"))

    this.expanded && !val ? this.el.classList.add("empty") : this.el.classList.remove("empty")

    this.el.dispatchEvent(new Event("search"))
  }

  /*
   * Toggle the appearance of the list based on the results
   */
  toggleSearch = () => {
    const isDisplayedLi = this.el.querySelectorAll("li.displayed").length

    isDisplayedLi ? this.open() : this.close()
  }

  /*
   * Toggle the appearance of the list based on the focus
   */
  focus = () => {
    const isDisplayedLi = this.el.querySelectorAll("li.displayed").length

    isDisplayedLi && this.open()
  }

  /*
   * Open the list
   */
  open = (t = "opened") => {
    this[t] = true
    this.el.classList.add(t)
  }

  /*
   * Close the list
   */
  close = (t = "opened") => {
    this[t] = false
    this.el.classList.remove(t)
  }

  /*
   * Toggle expand the list based on its initial state
   */
  expand = () => {
    const input = this.el.querySelector("input").value

    this.opened && this.close()
    this.expanded ? this.close("expanded") : this.el.dispatchEvent(new Event("expand")) && this.open("expanded")

    this.expanded && !input ? this.el.classList.add("empty") : this.el.classList.remove("empty")
  }

  /*
   * Handle the click when the list is open
   */
  handleClick = (e) => {
    const type = this.opened ? "opened" : "expanded"

    ;(this.opened || this.expanded) && !this.el.contains(e.target) && this.close(type)
  }
}

export default Datalist
