import fangiftService from "../services/fangiftService";
import { ITEMS_PER_PAGE } from "../utils/constants";
import spinner from "../utils/snip";
import templateCardWishlist from "../templates/card.wishlist";
import toastr from "toastr";

toastr.options.positionClass = "toast-bottom-center";

$(function () {
  const drawerOptions = {
    placement: "right",
    backdrop: true,
    bodyScrolling: false,
    edge: false,
    edgeOffset: "",
    backdropClasses:
      "bg-primary-black/30 [backdrop-filter:blur(4px)] fixed inset-0 z-30",
  };

  const $selectGiftEl = document.getElementById("drawer-select-gift");
  const $addGiftEl = document.getElementById("drawer-add-gift");
  const $giftDetailsEl = document.getElementById("drawer-gift-details");
  const $giftProductEl = document.getElementById("drawer-gift-product");
  const $giftCollectionEl = document.getElementById("drawer-gift-collection");
  const $confirmModalEl = document.getElementById("modal-confirm");

  const drawerSelectGift = new Drawer($selectGiftEl, drawerOptions);
  const drawerAddGift = new Drawer($addGiftEl, drawerOptions);
  const drawerGiftDetails = new Drawer($giftDetailsEl, drawerOptions);
  const drawerGiftProduct = new Drawer($giftProductEl, drawerOptions);
  const drawerGiftCollection = new Drawer($giftCollectionEl, drawerOptions);
  const confirmModal = new Modal($confirmModalEl);

  const state = {
    url: "",
    title: "",
    mainImage: null,
    shippingPrice: 0,
    digitalGood: false,
    after: null,
    deleteId: null,
  };

  $("#text-username").text(gUserInfo.name);

  $("#btn-add-gift").on("click", function () {
    drawerSelectGift.show();
  });

  $("#btn-gift-next").on("click", function () {
    state.giftSource = document.querySelector(
      "input[name=gift-source]:checked"
    ).value;
    drawerSelectGift.hide();

    if (state.giftSource === "fangift") {
      drawerAddGift.show();
    } else if (state.giftSource === "product") {
      drawerGiftProduct.show();
    }
  });

  $("#btn-product-link").on("click", function () {
    state.giftSource = "product";
    drawerGiftProduct.show();
  });

  $("#wrapper-main-image").on("click", function (e) {
    $("#file-main-image").trigger("click");
  });

  $("#file-main-image").on("change", function (e) {
    state.mainImage = e.target.files[0];
    if (state.mainImage) {
      const reader = new FileReader();

      reader.onload = function (e) {
        $("#img-product-main").attr("src", e.target.result);
      };

      reader.readAsDataURL(state.mainImage);
    }
  });

  $("#btn-next-product").on("click", async function () {
    state.url = $("#text-product-link").val();

    $(this).loading(true);
    const prodInfo = await fangiftService.post("scraper/product", {
      url: state.url,
    });
    state.mainImage = prodInfo.mainImage;
    $(this).loading(false);

    $("#text-product-title").val(prodInfo.title);
    $("#text-product-price").val(prodInfo.price);
    $("#img-product-main").prop("src", prodInfo.mainImage);

    drawerGiftProduct.hide();
    drawerGiftDetails.show();
  });

  $("#btn-add-wishlist").on("click", async function () {
    state.shippingPrice = $("#text-shipping-price").val();
    state.title = $("#text-product-title").val();
    state.price = $("#text-product-price").val();
    state.digitalGood = $("#checkbox-digital-good").prop("checked");

    $(this).loading(true);
    try {
      await fangiftService.post("products", {
        title: state.title,
        price: Number(state.price),
        digitalGood: state.digitalGood,
        shippingPrice: Number(state.shippingPrice),
        productUrl: state.url,
        mainImage: state.mainImage,
      });
      await loadWishlist();
      drawerGiftDetails.hide();
    } catch (err) {
      toastr.error(err.response.data.message);
    }

    $(this).loading(false);
  });

  $("#btn-save-collection").on("click", function () {
    drawerGiftCollection.hide();
  });

  $("#btn-add-next").on("click", function () {
    drawerAddGift.hide();
    drawerGiftDetails.show();
  });

  $("#btn-load-more").on("click", async function () {
    $(this).loading(true);
    const hasNextPage = await loadWishlist();
    $(this).loading(false, !hasNextPage);
  });

  $selectGiftEl
    .querySelector(".btn-close-drawer")
    .addEventListener("click", function () {
      drawerSelectGift.hide();
    });

  $addGiftEl
    .querySelector(".btn-close-drawer")
    .addEventListener("click", function () {
      drawerAddGift.hide();
    });

  $giftDetailsEl
    .querySelector(".btn-close-drawer")
    .addEventListener("click", function () {
      drawerGiftDetails.hide();
    });

  $giftProductEl
    .querySelector(".btn-close-drawer")
    .addEventListener("click", function () {
      drawerGiftProduct.hide();
    });

  $giftCollectionEl
    .querySelector(".btn-close-drawer")
    .addEventListener("click", function () {
      drawerGiftCollection.hide();
    });

  const loadWishlist = async (showSpinner = false) => {
    const container = $("#container-wishlists");

    if (showSpinner) {
      container.append(spinner.spin().el);
      container.addClass("min-h-[600px]");
    }

    const userInfo = JSON.parse(localStorage.getItem("payload"));
    const { products, pageInfo } = await fangiftService.get("/products", {
      params: {
        after: state.after,
        first: ITEMS_PER_PAGE,
        query: `vendor:${userInfo.name}`,
      },
    });
    state.after = pageInfo.endCursor;

    if (products.length) {
      $("#no-gifts").addClass("hidden");
      $("#no-gifts").removeClass("flex");
      $("#btn-load-more").show();

      products.forEach((product) =>
        container.append(
          templateCardWishlist({
            ...product,
            favorite: JSON.parse(product.metafields.favorite?.value ?? "false"),
          })
        )
      );

      $(".just-created .btn-card-delete").on("click", function () {
        const prodId = $(this).data("product");
        state.deleteId = prodId;
        confirmModal.show();
      });

      $(".just-created .btn-favorite").on("click", function () {
        const id = $(this).data("metafield");
        const prodId = $(this).data("product");
        const newValue = !$(this).hasClass("toggled");
        $(this).loading(true);
        fangiftService
          .put("/products/metafield", {
            id,
            value: newValue.toString(),
            prodId,
          })
          .then(() => {
            $(this).toggleClass("toggled");
            $(this).loading(false);
          });
      });

      $(".just-created").removeClass(".just-created");
    } else {
      $("#no-gifts").removeClass("hidden");
      $("#no-gifts").addClass("flex");
      $("#btn-load-more").hide();
    }

    if (showSpinner) {
      container.removeClass("min-h-[600px]");
      spinner.stop();
    }

    $("#btn-load-more").prop("disabled", !pageInfo.hasNextPage);

    return pageInfo.hasNextPage;
  };

  loadWishlist(true);
});
