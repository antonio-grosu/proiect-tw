document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login-btn");
  const loginForm = document.querySelector(".login-form");
  document.querySelector(".success-message").classList.add("hidden");
  document.querySelector(".error-message").classList.add("hidden");

  // localStorage.clear();
  function loginUser(email, password) {
    fetch("/account.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
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
          document.querySelector(".success-message").classList.remove("hidden");
          document.getElementById("login-form-btn").classList.add("hidden");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          document.querySelector(".error-message").classList.remove("hidden");
          document.getElementById("login-form-btn").classList.add("hidden");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
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
  if (!localStorage.getItem("user")) {
    document.querySelector(".account-section").classList.remove("hidden");
    document.querySelector(".review-section").classList.add("hidden");
  }

  fetch("/reviews.json")
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
