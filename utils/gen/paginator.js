const config = require("config");

exports.paginate = function (current_p, total) {
  const current = parseInt(current_p);
  const size = parseInt(config.get("page_size"));
  const _total = parseInt(total);
  const last_page = Math.ceil(_total / size);

  let next = 1;
  next = last_page !== 1 && last_page > current ? current + 1 : null;
  const startIndex = (current - 1) * size;

  return { startIndex, last_page, next };
};
