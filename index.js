document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login-btn");
  const loginForm = document.querySelector(".login-form");

  function loginUser(email, password) {
    fetch("http://127.0.0.1:5500/account.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text().then((text) => {
          return text ? JSON.parse(text) : {};
        });
      })
      .then((data) => {
        const user = data.find((user) => {
          const emailRegex = new RegExp(`^${email}$`, "i");
          const passwordRegex = new RegExp(`^${password}$`);
          return (
            emailRegex.test(user.email) && passwordRegex.test(user.password)
          );
        });
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          alert("Login successful");
        } else {
          alert("Invalid email or password");
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = loginForm.querySelector("input[type='email']").value;
    const password = loginForm.querySelector("input[type='password']").value;
    loginUser(email, password);
  });
  if (localStorage.getItem("user")) {
    document.querySelector(".account-section").classList.add("hidden");
  }

  fetch("http://127.0.0.1:5500/reviews.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((reviews) => {
      const reviewsContainer = document.querySelector(".reviews-container");
      reviewsContainer.innerHTML = reviews
        .map((review) => {
          if (review) {
            return `
                  <div class="review">
                      <h3>${review.user}</h3>
                      <p>${review.comment}</p>
                      <p><strong>Rating:</strong> ${review.rating}</p>

                  </div>
              `;
          }
        })
        .join("");
    })
    .catch((error) => console.error("Error:", error));
});
const reviewsArray = [];

fetch("http://127.0.0.1:5500/reviews.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((reviews) => {
    reviewsArray.push(...reviews);
    const reviewWrapper = document.querySelector(".review-wrapper");
    const existingContent = reviewWrapper.innerHTML;
    reviewWrapper.innerHTML =
      existingContent +
      reviewsArray
        .map(
          (review) => `
                <div class="review">
                    <h3>${review.user}</h3>
                    <p>${review.comment}</p>
                    <p><strong>Rating:</strong> ${review.rating}</p>
                </div>
            `
        )
        .join("");
  })
  .catch((error) => console.error("Error:", error));
