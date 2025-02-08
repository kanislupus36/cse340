const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#update-vehicle")
      updateBtn.removeAttribute("disabled")
    })