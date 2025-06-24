
document.addEventListener("DOMContentLoaded", function () {
    // Select elements using unique IDs
    const cuDropArea = document.getElementById("cu_drop_area");
    const cuFileInput = document.getElementById("cu_file_upload");
    const cuUploadDetails = document.getElementById("cu_upload_details");
    const cuFilename = document.getElementById("cu_filename");
    const cuFilesize = document.getElementById("cu_filesize");
    const cuThumbnail = document.getElementById("cu_thumbnail");
    const cuProgressContainer = document.getElementById("cu_progress_container");
    const cuProgressBar = document.getElementById("cu_progress_bar");
    const cuProgressPercentage = document.getElementById("cu_progress_percentage");
    const cuDeleteBtn = document.getElementById("cu_delete_btn");
    const cuCancelBtn = document.getElementById("cu_cancel_btn");
    const cuUploadBtn = document.getElementById("cu_upload_btn");
    const cuChooseFile = document.querySelector(".cu-choose-file");
  
    // Prevent default behavior for drag events
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      cuDropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  
    // Highlight drop area when file is dragged over
    ["dragenter", "dragover"].forEach(eventName => {
      cuDropArea.addEventListener(eventName, () => {
        cuDropArea.classList.add("dragover");
      });
    });
  
    // Remove highlight on drag leave or drop
    ["dragleave", "drop"].forEach(eventName => {
      cuDropArea.addEventListener(eventName, () => {
        cuDropArea.classList.remove("dragover");
      });
    });
  
    // Handle file drop
    cuDropArea.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      processFiles(files);
    });
  
    // Trigger hidden file input when "Choose file" is clicked
    cuChooseFile.addEventListener("click", () => {
      cuFileInput.click();
    });
  
    // Handle file selection through file input
    cuFileInput.addEventListener("change", (e) => {
      processFiles(e.target.files);
    });
  
    function processFiles(files) {
      if (!files || files.length === 0) return;
      const file = files[0];
  
      // Validate file type (ensure it's an image)
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }
  
      // Set file name and size
      cuFilename.textContent = file.name;
      cuFilesize.textContent = (file.size / (1024 * 1024)).toFixed(2) + " MB";
  
      // Use FileReader to load the image and update the thumbnail
      const reader = new FileReader();
      reader.onload = function (e) {
        cuThumbnail.src = e.target.result;
      }
      reader.readAsDataURL(file);
  
      // Show the upload details section and reset UI elements
      cuUploadDetails.classList.remove("d-none");
      cuProgressBar.style.width = "0%";
      cuProgressBar.setAttribute("aria-valuenow", 0);
      cuProgressPercentage.textContent = "0%";
      // Ensure progress container is visible and delete button is hidden
      cuProgressContainer.style.display = "block";
      cuDeleteBtn.classList.add("d-none");
      // Disable CTA buttons until upload is complete
      cuCancelBtn.disabled = true;
      cuUploadBtn.disabled = true;
  
      // Simulate file upload progress
      let progress = 0;
      const fakeUploadInterval = setInterval(() => {
        progress += 10;
        if (progress > 100) progress = 100;
        cuProgressBar.style.width = progress + "%";
        cuProgressBar.setAttribute("aria-valuenow", progress);
        cuProgressPercentage.textContent = progress + "%";
  
        // When upload reaches 100%
        if (progress === 100) {
          clearInterval(fakeUploadInterval);
          // Hide the progress section and show the delete icon
          cuProgressContainer.style.display = "none";
          cuDeleteBtn.classList.remove("d-none");
          // Enable CTA buttons
          cuCancelBtn.disabled = false;
          cuUploadBtn.disabled = false;
        }
      }, 500);
    }
  
    // Reset the upload state (used by Delete and Cancel)
    function resetUpload() {
      cuUploadDetails.classList.add("d-none");
      cuFileInput.value = "";
      cuThumbnail.src = "";
      cuProgressBar.style.width = "0%";
      cuProgressBar.setAttribute("aria-valuenow", 0);
      cuProgressPercentage.textContent = "0%";
      cuDeleteBtn.classList.add("d-none");
      cuCancelBtn.disabled = true;
      cuUploadBtn.disabled = true;
    }
  
    // When delete icon is clicked, reset the component
    cuDeleteBtn.addEventListener("click", resetUpload);
    
    // Similarly, if the Cancel button is clicked, reset the component
    cuCancelBtn.addEventListener("click", resetUpload);
    
    // (Optional) Upload button click – hook this into your actual upload logic
    cuUploadBtn.addEventListener("click", () => {
      console.log("File ready to be uploaded!");
      // You may include further logic here.
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const dropdownBtn   = document.getElementById("accountDropdownBtn");
  const labelSpan     = dropdownBtn.querySelector(".dropdown-label");
  const statusDotMain = document.getElementById("accountStatusDot");
  const bsDropdown    = new bootstrap.Dropdown(dropdownBtn);
  const items         = document.querySelectorAll(".select-with-dot .dropdown-item");

  function updateSelection(item) {
    // 1. Update the button label
    labelSpan.textContent = item.querySelector("span").textContent.trim();

    // 2. Mirror the dot color and show/hide it
    const dotColor = item.dataset.dot; // "" | "green" | "red"
    statusDotMain.className = "status-dot";
    if (dotColor) {
      statusDotMain.classList.add(dotColor);
      statusDotMain.style.display = "block";
    } else {
      statusDotMain.style.display = "none";
    }
  }

  // Wire up each menu item
  items.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      updateSelection(item);
      bsDropdown.hide();
    });
  });

  // Initialize to “All Accounts” (hides the dot)
  updateSelection(document.querySelector('.dropdown-item[data-value="all"]'));
});


