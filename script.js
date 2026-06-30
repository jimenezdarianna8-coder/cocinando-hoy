const form = document.querySelector("#portion-form");
const baseAmountInput = document.querySelector("#base-amount");
const baseServingsInput = document.querySelector("#base-servings");
const targetServingsInput = document.querySelector("#target-servings");
const result = document.querySelector("#portion-result");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const baseAmount = Number(baseAmountInput.value);
    const baseServings = Number(baseServingsInput.value);
    const targetServings = Number(targetServingsInput.value);

    if (!baseAmount || !baseServings || !targetServings || baseAmount <= 0 || baseServings <= 0 || targetServings <= 0) {
      result.textContent = "Completa las cantidades con numeros validos.";
      return;
    }

    const adjustedAmount = baseAmount * (targetServings / baseServings);
    result.textContent = `Necesitas aproximadamente ${adjustedAmount.toLocaleString("es-DO", {
      maximumFractionDigits: 2
    })} de ese ingrediente.`;
  });
}

const recipeImage = document.querySelector("#recipe-image");
const imagePreview = document.querySelector("#image-preview");

function fileToCompressedImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const maxWidth = 900;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };

      img.onerror = reject;
      img.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

if (recipeImage && imagePreview) {
  recipeImage.addEventListener("change", async () => {
    const file = recipeImage.files[0];

    if (!file) {
      imagePreview.innerHTML = "<span>Vista previa de imagen</span>";
      return;
    }

    try {
      const previewImage = await fileToCompressedImage(file);
      imagePreview.innerHTML = `<img src="${previewImage}" alt="Vista previa de la receta">`;
    } catch {
      imagePreview.innerHTML = "<span>No se pudo cargar la imagen.</span>";
    }
  });
}

const cookieBanner = document.querySelector("#cookie-banner");
const acceptCookies = document.querySelector("#accept-cookies");
const cookieStorageKey = "cocinando-hoy-cookies-ok";

if (cookieBanner && acceptCookies) {
  if (localStorage.getItem(cookieStorageKey) !== "yes") {
    cookieBanner.classList.add("show");
  }

  acceptCookies.addEventListener("click", () => {
    localStorage.setItem(cookieStorageKey, "yes");
    cookieBanner.classList.remove("show");
  });
}
