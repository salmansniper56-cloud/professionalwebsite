import { useEffect, useState } from "react"
import homeMarkup from "./reference/home.html?raw"

const referenceOrigin = "https://lusion.co"

function applyBranding(root: ParentNode & Node) {
  const logo = root.querySelector("#header-logo")
  if (logo && logo.textContent !== "Website Solution") {
    logo.textContent = "Website Solution"
    logo.setAttribute("aria-label", "Website Solution home")
  }

  root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || ""
    // Keep the original layout without sending visitors to the reference brand.
    if (/lusion/i.test(href)) {
      link.removeAttribute("href")
      link.removeAttribute("target")
      link.setAttribute("aria-disabled", "true")
      link.setAttribute("title", "Link not configured yet")
    }
  })

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (node.parentElement?.closest("script, style")) continue
    const text = node.nodeValue || ""
    const branded = text
      .replace(/(?:hello|business)@lusion\.co/gi, "Contact details coming soon")
      .replace(/labs\.lusion\.co/gi, "Website Solution")
      .replace(/\blusion\b/gi, "Website Solution")
    if (branded !== text) node.nodeValue = branded
  }
}

function brandMarkup(markup: string) {
  const page = new DOMParser().parseFromString(markup, "text/html")
  applyBranding(page.body)
  return page.body.innerHTML
}

export default function App() {
  const [markup, setMarkup] = useState(
    window.location.pathname === "/" ? brandMarkup(homeMarkup) : "",
  )
  const [error, setError] = useState("")

  useEffect(() => {
    if (window.location.pathname === "/") return
    const controller = new AbortController()

    async function loadPage() {
      try {
        const response = await fetch(
          `${referenceOrigin}${window.location.pathname}`,
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error("Page unavailable")
        const document = new DOMParser().parseFromString(
          await response.text(),
          "text/html",
        )
        document.querySelectorAll("script").forEach((script) => script.remove())
        setMarkup(brandMarkup(document.body.innerHTML))
      } catch {
        if (!controller.signal.aborted) {
          setError(
            "This page could not be loaded. Please return to the home page.",
          )
        }
      }
    }

    void loadPage()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!markup) return
    document.title = "Website Solution"

    // The interactive runtime can insert page markup during navigation.
    const observer = new MutationObserver(() => {
      applyBranding(document.getElementById("root")!)
      if (document.title !== "Website Solution") document.title = "Website Solution"
    })
    observer.observe(document.getElementById("root")!, {
      childList: true,
      subtree: true,
    })
    observer.observe(document.head, { childList: true, subtree: true })

    // The reference runtime owns its WebGL scene and animated DOM after mounting.
    // Keep a single instance through React StrictMode's effect replay.
    if (!document.getElementById("lusion-runtime")) {
      const script = document.createElement("script")
      script.id = "lusion-runtime"
      script.type = "module"
      script.src = "/lusion/runtime.js"
      script.onerror = () =>
        setError("The interactive experience could not load.")
      document.body.appendChild(script)
    }

    // Never submit visitors' email addresses to the reference site's mailing list.
    const protectNewsletter = (event: SubmitEvent) => {
      const form = event.target
      if (!(form instanceof HTMLFormElement) || !form.id.includes("newsletter"))
        return
      event.preventDefault()
      event.stopImmediatePropagation()
      const message = document.getElementById(
        form.id.startsWith("header")
          ? "header-menu-newsletter-feedback-message"
          : "footer-newsletter-feedback-message",
      )
      if (message) {
        message.setAttribute("role", "status")
        message.textContent =
          "Newsletter subscriptions are not configured yet."
      }
    }
    document.addEventListener("submit", protectNewsletter, true)
    return () => {
      observer.disconnect()
      document.removeEventListener("submit", protectNewsletter, true)
    }
  }, [markup])

  if (error) {
    return (
      <div className="reference-error" role="alert">
        {error} <a href="/">Home</a>
      </div>
    )
  }

  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}
