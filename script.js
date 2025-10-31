// ===== Course and Fee Calculation =====

const numCoursesSelect = document.getElementById("numCourses");
const courseSelectorsDiv = document.getElementById("courseSelectors");
const totalFeesDisplay = document.getElementById("totalFees");

const courses = {
  "First Aid": 1500,
  Sewing: 1500,
  Landscaping: 1500,
  "Life Skills": 1500,
  "Child Minding": 750,
  Cooking: 750,
  "Garden Maintenance": 750,
};

// Handle course selection dynamically
numCoursesSelect.addEventListener("change", () => {
  const numCourses = parseInt(numCoursesSelect.value);
  courseSelectorsDiv.innerHTML = ""; // Clear old dropdowns

  if (!isNaN(numCourses)) {
    for (let i = 0; i < numCourses; i++) {
      const select = document.createElement("select");
      select.classList.add("course-select");
      select.innerHTML =
        `<option value="">Select Course ${i + 1}</option>` +
        Object.keys(courses)
          .map((c) => `<option value="${c}">${c} (R${courses[c]})</option>`)
          .join("");
      select.addEventListener("change", calculateFees);
      courseSelectorsDiv.appendChild(select);
    }
  }

  calculateFees();
});

function calculateFees() {
  const selectedCourses = document.querySelectorAll(".course-select");
  let total = 0;

  selectedCourses.forEach((select) => {
    if (select.value) {
      total += courses[select.value];
    }
  });

  const numCourses = selectedCourses.length;

  let discount = 0;
  if (numCourses === 2) discount = 0.05;
  else if (numCourses === 3) discount = 0.1;
  else if (numCourses >= 4) discount = 0.15;

  const discountAmount = total * discount;
  const finalTotal = total - discountAmount;

  totalFeesDisplay.textContent = `Total fees: R ${finalTotal.toFixed(
    2
  )} (Discount: R ${discountAmount.toFixed(2)})`;
}

// ===== EmailJS Form Submission =====

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("courseForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const phone = form.querySelector('input[name="phone"]').value;
    const numCourses = form.querySelector("#numCourses").value;
    const totalFees = document.getElementById("totalFees").textContent;

    // Gather selected courses
    const selectedCourses = Array.from(
      document.querySelectorAll(".course-select")
    )
      .map((sel) => sel.value)
      .filter((val) => val !== "")
      .join(", ");

    const templateParams = {
      to_email: email,
      from_name: "Empowering The Nation",
      user_name: name,
      user_phone: phone,
      num_courses: numCourses,
      selected_courses: selectedCourses,
      total_fees: totalFees,
    };

    emailjs
      .send("service_mhsxtgq", "template_bhsg6ae", templateParams)
      .then(
        function (response) {
          alert(
            " Enquiry submitted successfully! A confirmation email has been sent to " +
              email
          );
          form.reset();
          totalFeesDisplay.textContent = "Total fees: R 0";
          courseSelectorsDiv.innerHTML = "";
        },
        function (error) {
          alert(" Failed to send email. Please try again.");
          console.error("EmailJS error:", error);
        }
      );
  });
});
