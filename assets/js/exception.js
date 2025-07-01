$(document).on('click', '.show-more', function () {
  const $icon = $(this);
  const $row = $icon.closest('tr');
  const $hidden = $row.next('.hidden-table-section');

  if ($hidden.is(':visible')) {
    $hidden.slideUp(200);
  } else {
    $hidden.slideDown(200);
  }
});
