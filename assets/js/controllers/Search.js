import Datalist from "../components/Datalist.js"

class Search {
  constructor() {
    this.dataLists = []

    this.init()
  }

  init = () => {
    const datalists = document.querySelectorAll('[data-component="datalist"]')

    datalists.forEach((d) => this.dataLists.push(new Datalist(d)))

    this.bindEvents()
  }

  bindEvents = () => {
    const datalists = document.querySelectorAll('[data-component="datalist"]')

    datalists.forEach((d) => d.addEventListener("expand", this.closeExpandedDataLists))
  }

  /*
   * Close other lists when another opens
   */
  closeExpandedDataLists = (e) => {
    this.dataLists.map((d) => d !== e.target && d.expanded && d.close("expanded"))
  }
}

export default Search
