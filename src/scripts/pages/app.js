import LINKS from "../constants/links";
import PAGE_ROLES from "../constants/pageRoles";
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
  const pageRole =
    Object.values(LINKS).filter((link) => pathname === link.path)[0]?.role ??
    PAGE_ROLES.unknown;
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

  if (pageRole === PAGE_ROLES.public) {
    $("body").removeClass("hidden");
  } else if (pageRole === PAGE_ROLES.unknown) {
    window.location.href = LINKS.home.path;
  } else if (validExp) {
    if (
      pageRole === PAGE_ROLES.creator &&
      gUserInfo.type !== PAGE_ROLES.creator
    ) {
      window.location.href = LINKS.explore.path;
      return;
    }

    if (pageRole === PAGE_ROLES.fan && gUserInfo.type !== PAGE_ROLES.fan) {
      window.location.href = LINKS.wishlist.path;
      return;
    }

    if (gUserInfo.picture) {
      $("#img-avatar").prop("src", getS3Url(gUserInfo.picture));
    }

    if (gUserInfo.type === PAGE_ROLES.creator) {
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
