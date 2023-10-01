import LINKS from "../constants/links";
import { refreshSession } from "../utils/session";
import { getS3Url } from "../utils/string";

function updateUserInfo(userInfo) {
  userInfo = userInfo ?? JSON.parse(localStorage.getItem("payload"));
  if (userInfo) {
    window.gUserInfo = Object.freeze(
      Object.entries(userInfo).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key.replace("custom:", "")]: value,
        }),
        {}
      )
    );
    Object.defineProperty(window, "gUserInfo", {
      configurable: false,
      writable: false,
    });
  }
}

$(async function () {
  const pathname = location.pathname;
  const isPublicPage =
    pathname === "/" ||
    Object.values(LINKS)
      .filter((link) => link.public)
      .some((link) => pathname.startsWith(link.path));
  const expiration = Number(localStorage.getItem("exp"));
  const validExp = new Date() < new Date(expiration);

  updateUserInfo();

  $("#btn-signout").on("click", function () {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("exp");
    localStorage.removeItem("payload");
    localStorage.removeItem("refreshToken");
    location.href = "/account/login";
  });

  if (isPublicPage) {
    $("body").removeClass("hidden");
  } else if (validExp) {
    if (gUserInfo.picture) {
      $("#img-avatar").prop("src", getS3Url(gUserInfo.picture));
    }

    if (gUserInfo.type === "creator") {
      $("#creator-menu").removeClass("hidden");
      $("#creator-menu").addClass("xl:flex");
    } else {
      $("#fan-menu").removeClass("hidden");
      $("#fan-menu").addClass("xl:flex");
    }

    $("body").removeClass("hidden");
  } else {
    await refreshSession();
  }
});
