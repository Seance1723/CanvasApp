
// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", function () {

  // ---------------------------------------------
  // EXPAND / COLLAPSE FUNCTIONALITY
  // ---------------------------------------------
  let expanded = false;
  let originalCardsHTML = "";
  const toggleBtn = document.getElementById("toggleExpandTab");
  const accountDropdown = document.getElementById("accountDropdownTab");
  const accDropdownBtn = document.getElementById("accountDropdownBtn");
  const collapseModal = new bootstrap.Modal(document.getElementById("collapseModal"));
  const cardsContainer = document.getElementById("cardsContainerTab");

  toggleBtn.addEventListener("click", function() {
    if (!expanded) {
      originalCardsHTML = cardsContainer.innerHTML;
      expanded = true;
      toggleBtn.innerHTML = '<i class="fa fa-angle-double-up"></i> Collapse';
      accDropdownBtn.disabled = false;
      createGroups();
    } else {
      collapseModal.show();
    }
  });

  document.getElementById("modalContinue").addEventListener("click", function() {
    expanded = false;
    toggleBtn.innerHTML = '<i class="fa fa-angle-double-down"></i> Expand';
    accountDropdown.disabled = true;
    resetGrouping();
    collapseModal.hide();
  });

  accountDropdown.addEventListener("change", function() {
    const groups = document.querySelectorAll(".group-section");
    groups.forEach(group => {
      const brand = group.getAttribute("data-brand");
      group.style.display = (this.value === "all" || brand === this.value) ? "block" : "none";
    });
  });

  function createGroups() {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = originalCardsHTML;
    const cards = Array.from(tempDiv.querySelectorAll(".card-wrapper"));
    cardsContainer.innerHTML = "";

    const amazon = document.createElement("div");
    amazon.className = "group-section";
    amazon.setAttribute("data-brand", "amazon");
    amazon.innerHTML = "<h4>Amazon</h4><div class='row g-3'></div>";
    const bigbasket = document.createElement("div");
    bigbasket.className = "group-section";
    bigbasket.setAttribute("data-brand", "bigbasket");
    bigbasket.innerHTML = "<h4>BigBasket</h4><div class='row g-3'></div>";

    cards.forEach(card => {
      amazon.querySelector("div").appendChild(card.cloneNode(true));
      bigbasket.querySelector("div").appendChild(card.cloneNode(true));
    });

    cardsContainer.appendChild(amazon);
    cardsContainer.appendChild(bigbasket);
  }

  function resetGrouping() {
    cardsContainer.innerHTML = originalCardsHTML;
  }

  // ---------------------------------------------
  // LIGHTBOX
  // ---------------------------------------------
  cardsContainer.addEventListener("click", function(e) {
    const ignored = ["plus-icon", "delete-icon", "info-icon"];
    if (ignored.some(cls => e.target.classList.contains(cls))) return;
    const body = e.target.closest(".card-body");
    if (body) {
      const bg = getComputedStyle(body).backgroundImage;
      if (bg && bg !== "none") {
        const url = bg.slice(5, -2);
        const modal = new bootstrap.Modal(document.getElementById("lightboxModal"));
        document.getElementById("lightboxModal").querySelector("img").src = url;
        modal.show();
      }
    }
  });

  // ---------------------------------------------
  // DRAG & DROP
  // ---------------------------------------------
  let dragSourceCard = null;
  cardsContainer.addEventListener("dragstart", function(e) {
    const card = e.target.closest(".card-wrapper");
    if (card) {
      const body = card.querySelector(".card-body");
      const bg = getComputedStyle(body).backgroundImage;
      if (bg === "none") { e.preventDefault(); return; }
      dragSourceCard = card;
      const img = document.createElement("img");
      img.src = bg.slice(5, -2);
      img.style.opacity = "0.5";
      img.style.width = "120px";
      img.style.height = "120px";
      document.body.appendChild(img);
      e.dataTransfer.setDragImage(img, 60, 60);
      setTimeout(() => { document.body.removeChild(img); }, 0);
    }
  });

  cardsContainer.addEventListener("dragover", function(e) { e.preventDefault(); });

  cardsContainer.addEventListener("drop", function(e) {
    e.preventDefault();
    const target = e.target.closest(".card-wrapper");
    if (dragSourceCard && target && target !== dragSourceCard) {
      const tBody = target.querySelector(".card-body");
      if (getComputedStyle(tBody).backgroundImage === "none") {
        const sBody = dragSourceCard.querySelector(".card-body");
        const src = getComputedStyle(sBody).backgroundImage.slice(5, -2);
        tBody.style.backgroundImage = `url(${src})`;
        sBody.style.backgroundImage = "none";
      }
    }
    dragSourceCard = null;
  });

  // ---------------------------------------------
  // SCORING: Animate & Reset
  // ---------------------------------------------
  // When you click #scoreBtn → show modal + run scores immediately
  $('#scoreBtn').on('click', function () {
    $('#scoringProgressModal').modal('show');

    const $score = $(this);
    if ($score.is(':visible') && $score.text().trim() !== '') {
      $('#downloadScoreButton').show();
    }

    $('.image-card').each(function () {
      const $card = $(this);
      const $body = $card.find('.card-body');
      const bg = $body.css('background-image');

      if (bg && bg !== 'none') {
        const $header = $card.find('.card-header');
        const $trash = $header.find('.delete-icon');

        if (!$trash.parent().hasClass('action-area')) {
          $trash.wrap('<span class="action-area"></span>');
        }

        const $actionArea = $trash.parent();
        $actionArea.find('.score').remove();

        const score = Math.floor(Math.random() * 100) + 1;
        const cls = score <= 50 ? 'danger' : 'success';

        const $s = $('<span>').addClass(`score ${cls}`).text('0%');
        $trash.before($s);

        $({ val: 0 }).animate(
          { val: score },
          {
            duration: 800,
            easing: 'swing',
            step: function (now) {
              $s.text(Math.floor(now) + '%');
            },
            complete: function () {
              $s.text(score + '%');
            }
          }
        );
      }
    });
  });


  $(document).on('click', '.delete-icon', function () {
    const $c = $(this).closest('.image-card');
    $c.find('.card-body').css('background-image', '');
    $c.find('.plus-icon').show();
    $(this).hide();
    const $a = $(this).parent('.action-area');
    if ($a.length) { $a.find('.score').remove(); }
  });

});

$(document).on('click', '.score', function () {
  $('#scoreCardModal').modal('show');
});

