// Shared header, footer and small helpers used by every page.
import { studio } from "./content.js";

export const WA_ICON =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4 5.2 5.2 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3Z"/></svg>';

// Two offset layers: the studio mark reads as depth.
export const MARK =
  '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="3" width="19" height="19" rx="5" fill="#2E5BFF" opacity=".55"/><rect x="10" y="10" width="19" height="19" rx="5" fill="currentColor"/></svg>';

export function waLink(message = studio.waMessage) {
  return `https://wa.me/${studio.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mountChrome(current) {
  const pages = [
    ["work.html", "Work"],
    ["services.html", "Services"],
    ["about.html", "About"],
  ];
  const header = document.getElementById("site-header");
  header.className = "top";
  header.innerHTML = `
    <div class="wrap">
      <a class="brand" href="./">${MARK}<span>${studio.name}</span></a>
      <nav aria-label="Main">
        ${pages.map(([href, label]) => `<a class="nav-link" href="${href}"${current === href ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
        <a class="btn btn-wa" href="${waLink()}" target="_blank" rel="noopener">${WA_ICON}WhatsApp</a>
      </nav>
    </div>`;

  const footer = document.getElementById("site-footer");
  const contacts = [
    `<a href="${waLink()}" target="_blank" rel="noopener">WhatsApp +${studio.whatsapp}</a>`,
    studio.email ? `<a href="mailto:${studio.email}">${studio.email}</a>` : "",
    studio.instagram ? `<a href="https://instagram.com/${studio.instagram}" target="_blank" rel="noopener">@${studio.instagram}</a>` : "",
  ]
    .filter(Boolean)
    .join("");
  footer.innerHTML = `
    <div class="wrap">
      <span>${studio.name}${studio.owner ? `, ${studio.owner}` : ""}. ${studio.city}.</span>
      <span class="contacts">${contacts}</span>
    </div>`;
}

// Tilts a figure toward the pointer: the same depth the stage has, on flat images.
export function tilt(container, selector = ".tile") {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  container.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const card = e.target.closest(selector);
    if (!card) return;
    const fig = card.querySelector("figure");
    const r = fig.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    fig.style.setProperty("--ry", `${x * 8}deg`);
    fig.style.setProperty("--rx", `${-y * 6}deg`);
  });
  container.addEventListener("pointerout", (e) => {
    const card = e.target.closest(selector);
    if (!card) return;
    const fig = card.querySelector("figure");
    fig.style.setProperty("--ry", "0deg");
    fig.style.setProperty("--rx", "0deg");
  });
}

export function imgSrc(file, small = false) {
  return `${import.meta.env.BASE_URL}work/${file}${small ? "-sm" : ""}.jpg`;
}
