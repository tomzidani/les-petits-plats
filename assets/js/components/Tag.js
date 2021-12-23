class Tag {
  constructor(name, type, listEl) {
    this.el = null
    this.listEl = listEl
    this.name = name
    this.type = type

    this.init()
  }

  init = async () => {
    this.el = await this.displayTag()
    this.toggleHide()

    this.bindEvents()
  }

  bindEvents = () => {
    const remove = this.el.querySelector("button")

    remove.addEventListener("click", this.removeTag)
  }

  /*
   * Display the tag in the DOM
   */
  displayTag = () => {
    return new Promise((resolve) => {
      const wrapper = document.querySelector('[data-content="tags"]')
      const tagEl = document.createElement("div")

      tagEl.className = "tag"
      tagEl.dataset.name = this.name
      tagEl.dataset.type = this.type
      tagEl.innerHTML =
        `<div class="tag__wrapper"><b class="tag__name">${this.name}</b>` +
        `<button class="tag__remove"><img src="./assets/img/icons/close.svg" alt="Supprimer le tag" /></button>` +
        `</div>`

      wrapper.appendChild(tagEl)

      resolve(tagEl)
    })
  }

  /*
   * Remove the tag
   */
  removeTag = (e) => {
    e.preventDefault()

    this.el.remove()
    this.toggleHide()

    this.listEl.dispatchEvent(new Event("deletetag"))
  }

  /*
   * Toggles the appearance of the list element linked to the tag according to the display of the tag
   */
  toggleHide = () => {
    this.listEl.classList.toggle("tagged")
  }
}

export default Tag
