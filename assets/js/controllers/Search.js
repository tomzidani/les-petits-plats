import DataList from "../components/Datalist.js"
import Tag from "../components/Tag.js"
import recipes from "../utils/provider/recipes.js"

class Search {
  constructor() {
    this.recipes = recipes

    this.dataLists = []
    this.tags = []

    this.init()
  }

  init = async () => {
    this.dataLists = await this.getDataLists()

    this.bindEvents()
  }

  bindEvents = () => {
    this.bindDataListsEvents()
  }

  /*
   * Retrieving and creating data lists
   */
  getDataLists = () => {
    return new Promise((resolve) => {
      const dataListsEl = document.querySelectorAll('[data-component="datalist"]')
      let dataLists = []

      dataListsEl.forEach((d) => dataLists.push(new DataList(d)))

      resolve(dataLists)
    })
  }

  /*
   * Bind events of data lists
   */
  bindDataListsEvents = () => {
    this.dataLists.map((d) => {
      const listElements = d.el.querySelectorAll("li")

      d.el.addEventListener("expand", this.closeExpandedDataLists)

      listElements.forEach((l) => {
        l.addEventListener("tag", this.createTag)
        l.addEventListener("deletetag", this.removeTag)
      })
    })
  }

  /*
   * Close other lists when another opens
   */
  closeExpandedDataLists = (e) => {
    this.dataLists.map((d) => d.el !== e.target && d.expanded && d.toggleExpand())
  }

  /*
   * Create a tag
   */
  createTag = (e) => {
    const tag = new Tag(e.target.textContent, e.tagType, e.target)

    this.tags.push(tag)
  }

  /*
   * Delete a tag
   */
  removeTag = (e) => {
    this.tags = this.tags.filter((t) => t.listEl !== e.target)
  }
}

export default Search
