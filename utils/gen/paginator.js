exports.paginate = function (current_p, pageSize, total) {
  const current = parseInt(current_p);
  const size = parseInt(pageSize);
  const _total = parseInt(total);

  const startIndex = (current - 1) * size;
  const last_page = Math.ceil(_total / size);
  return { current, startIndex, last_page };
};
