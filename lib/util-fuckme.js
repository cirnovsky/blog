import { visit } from "unist-util-visit";

export default function fuckUnified() {
    return (tree) => {
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
                    node.properties.className = (node.properties.className || []).concat("inline-image");
                } else {
                    node.properties.className = (node.properties.className || []).concat("post-image");
                }
            }
        });
    };
}