import { visit } from "unist-util-visit";
import assert from "assert";

export default function fuckUnified() {
  return (tree) => {
    // console.log(tree);
    visit(tree, "element", (node) => {
      if (node.tagName === "img") {
        // Create a new attributes object if it doesn't exist
        if (!node.properties) {
          node.properties = {};
        }
        node.properties.loading = "lazy";
        node.properties.decoding = "async";
        node.properties["data-nimg"] = "1";

        const alt = node.properties.alt;
        if ((alt || "caonimabi").endsWith(" il")) {
          node.properties.className = (node.properties.className || []).concat(
            "inline-image"
          );
        } else {
          node.properties.className = (node.properties.className || []).concat(
            "post-image"
          );
        }
      } else if (node.tagName === "pre") {
        assert(node.children.length > 0);
        assert(node.children[0].tagName == "code");
        if (
          (node.children[0].properties.className || [
            "caonima, shabi",
          ])[0].startsWith("language")
        )
          node.children[0].properties.className =
            node.children[0].properties.className
              .concat("line-numbers");
      } else if (node.tagName === "h1") {
        node.children[0].value = "☆ " + node.children[0].value;
      } else if (node.tagName === "h2") {
        node.children[0].value = "§ " + node.children[0].value;
      } else if (node.tagName === "h3") {
        node.children[0].value = "∆ " + node.children[0].value;
      }
    });
  };
}
