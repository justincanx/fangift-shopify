$.fn.loading = function (isLoading = true, opt) {
  const options = {
    keepDisabled: false,
    size: "w-8 h-8",
    ...opt,
  };

  if (isLoading) {
    this.width(this.width());
    const content = this.html();
    this.data("content", content);
    this.html(`
      <svg
        aria-hidden="true"
        class="${options.size} text-gray-200 animate-spin fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
    `);
    this.prop("disabled", true);
  } else {
    this.width("");
    this.html(this.data("content"));
    this.data("content", null);
    this.prop("disabled", options.keepDisabled);
  }

  return this;
};

$.fn.error = function (show = true, error) {
  const errorClass =
    "after:text-red-500 after:text-[12px] after:content-[attr(error)]";
  if (show) {
    if (error) {
      this.closest(".error").prop("error", error);
    }
    this.closest(".error").addClass(errorClass);
  } else {
    this.closest(".error").removeClass(errorClass);
  }
};

$.fn.password = function () {
  const $container = this.closest(".password");

  $container.addClass("relative");
  $container.append(`
    <button type="button" class="absolute right-4 top-5">
      <svg fill="#D9D9D9" width="24px" height="24px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
          d="M47.0849493,2.84217094e-14 L409.751616,362.666662 L379.581717,392.836561 L320.374817,333.628896 C291.246618,353.329494 255.728838,367.084945 213.333333,367.084945 C64,367.084945 7.10542736e-15,196.418278 7.10542736e-15,196.418278 C7.10542736e-15,196.418278 22.8621027,135.452671 73.141042,86.3971998 L16.9150553,30.169894 L47.0849493,2.84217094e-14 Z M213.333333,25.7516113 C362.666667,25.7516113 426.666667,196.418278 426.666667,196.418278 C426.666667,196.418278 412.428071,234.387867 381.712212,274.508373 L285.871605,178.644581 C279.289844,151.690235 258.075932,130.47205 231.123994,123.884151 L145.662385,38.4000762 C165.913597,30.494948 188.437631,25.7516113 213.333333,25.7516113 Z M138.666667,196.418278 C138.666667,237.655539 172.096072,271.084945 213.333333,271.084945 C226.192194,271.084945 238.291853,267.834416 248.85545,262.110219 L215.113754,228.369585 C214.524387,228.401906 213.930772,228.418278 213.333333,228.418278 C195.660221,228.418278 181.333333,214.09139 181.333333,196.418278 C181.333333,195.820501 181.349724,195.226552 181.382081,194.636857 L147.641392,160.896162 C141.917195,171.459758 138.666667,183.559417 138.666667,196.418278 Z"
          transform="translate(42.667 59.582)" />
      </svg>
    </button>
  `);

  $container.find("button").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).empty();

    if ($(this).hasClass("view-password")) {
      $(this).html(`
        <svg fill="#D9D9D9" width="24px" height="24px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M47.0849493,2.84217094e-14 L409.751616,362.666662 L379.581717,392.836561 L320.374817,333.628896 C291.246618,353.329494 255.728838,367.084945 213.333333,367.084945 C64,367.084945 7.10542736e-15,196.418278 7.10542736e-15,196.418278 C7.10542736e-15,196.418278 22.8621027,135.452671 73.141042,86.3971998 L16.9150553,30.169894 L47.0849493,2.84217094e-14 Z M213.333333,25.7516113 C362.666667,25.7516113 426.666667,196.418278 426.666667,196.418278 C426.666667,196.418278 412.428071,234.387867 381.712212,274.508373 L285.871605,178.644581 C279.289844,151.690235 258.075932,130.47205 231.123994,123.884151 L145.662385,38.4000762 C165.913597,30.494948 188.437631,25.7516113 213.333333,25.7516113 Z M138.666667,196.418278 C138.666667,237.655539 172.096072,271.084945 213.333333,271.084945 C226.192194,271.084945 238.291853,267.834416 248.85545,262.110219 L215.113754,228.369585 C214.524387,228.401906 213.930772,228.418278 213.333333,228.418278 C195.660221,228.418278 181.333333,214.09139 181.333333,196.418278 C181.333333,195.820501 181.349724,195.226552 181.382081,194.636857 L147.641392,160.896162 C141.917195,171.459758 138.666667,183.559417 138.666667,196.418278 Z"
            transform="translate(42.667 59.582)" />
        </svg>
      `);
      $(this).siblings("input").prop("type", "password");
      $(this).removeClass("view-password");
    } else {
      $(this).html(`
        <svg width="24px" height="24px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g fill="#D9D9D9" transform="translate(42.666667, 85.333333)">
              <path d="M213.333333,1.42108547e-14 C362.666667,1.42108547e-14 426.666667,170.666667 426.666667,170.666667 C426.666667,170.666667 362.666667,341.333333 213.333333,341.333333 C64,341.333333 7.10542736e-15,170.666667 7.10542736e-15,170.666667 C7.10542736e-15,170.666667 64,1.42108547e-14 213.333333,1.42108547e-14 Z M213.333333,96 C172.096427,96 138.666667,129.42976 138.666667,170.666667 C138.666667,211.903573 172.096427,245.333333 213.333333,245.333333 C254.57024,245.333333 288,211.903573 288,170.666667 C288,129.42976 254.57024,96 213.333333,96 Z M213.333333,202.666667 C195.688747,202.666667 181.333333,188.311253 181.333333,170.666667 C181.333333,153.02208 195.688747,138.666667 213.333333,138.666667 C230.97792,138.666667 245.333333,153.02208 245.333333,170.666667 C245.333333,188.311253 230.97792,202.666667 213.333333,202.666667 Z"></path>
            </g>
          </g>
        </svg>
      `);
      $(this).siblings("input").prop("type", "text");
      $(this).addClass("view-password");
    }
  });
};
