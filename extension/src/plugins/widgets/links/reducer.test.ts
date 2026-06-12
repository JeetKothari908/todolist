import { addLink, removeLink, updateLink, reorderLink } from "./actions";
import { reducer } from "./reducer";

describe("links/reducer()", () => {
  it("should add new links", () => {
    expect(reducer([], addLink())).toEqual([{ url: "https://" }]);
    expect(
      reducer([{ url: "https://github.com/JeetKothari908/LocalFlow/" }], { type: "ADD_LINK" }),
    ).toEqual([{ url: "https://github.com/JeetKothari908/LocalFlow/" }, { url: "https://" }]);
  });

  it("should remove links", () => {
    expect(
      reducer(
        [
          { url: "https://github.com/JeetKothari908/LocalFlow/" },
          { url: "https://github.com/JeetKothari908/LocalFlow/about.html" },
        ],
        removeLink(0),
      ),
    ).toEqual([{ url: "https://github.com/JeetKothari908/LocalFlow/about.html" }]);
  });

  it("should update links", () => {
    expect(
      reducer(
        [
          { url: "https://github.com/JeetKothari908/LocalFlow/" },
          { url: "https://github.com/JeetKothari908/LocalFlow/about.html" },
        ],
        updateLink(0, { name: "LocalFlow", url: "https://github.com/JeetKothari908/LocalFlow/" }),
      ),
    ).toEqual([
      { name: "LocalFlow", url: "https://github.com/JeetKothari908/LocalFlow/" },
      { url: "https://github.com/JeetKothari908/LocalFlow/about.html" },
    ]);
  });

  it("should reorder links", () => {
    expect(
      reducer(
        [
          { url: "https://github.com/JeetKothari908/LocalFlow/" },
          { url: "https://github.com/JeetKothari908/LocalFlow/about.html" },
          { url: "https://github.com/JeetKothari908/LocalFlow" },
        ],
        reorderLink(1, 0),
      ),
    ).toEqual([
      { url: "https://github.com/JeetKothari908/LocalFlow/about.html" },
      { url: "https://github.com/JeetKothari908/LocalFlow/" },
      { url: "https://github.com/JeetKothari908/LocalFlow" },
    ]);

    expect(
      reducer(
        [
          { url: "https://github.com/JeetKothari908/LocalFlow/" },
          { url: "https://github.com/JeetKothari908/LocalFlow/about.html" },
          { url: "https://github.com/JeetKothari908/LocalFlow" },
        ],
        reorderLink(1, 2),
      ),
    ).toEqual([
      { url: "https://github.com/JeetKothari908/LocalFlow/" },
      { url: "https://github.com/JeetKothari908/LocalFlow" },
      { url: "https://github.com/JeetKothari908/LocalFlow/about.html" },
    ]);
  });

  it("should throw on unknown action", () => {
    expect(() => reducer([], { type: "UNKNOWN" } as any)).toThrow();
  });
});
