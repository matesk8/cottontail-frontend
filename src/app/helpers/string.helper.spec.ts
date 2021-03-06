import {StringHelper} from "./string.helper";

describe("StringHelper", () => {

    /** @name StringHelper_dirPathToArrayTest */
    describe("dirPathToArray()", () => {

        it("should convert a directory path like ./some/dir to an array", () => {
            let str = StringHelper.dirPathToArray("./");
            expect(str).toEqual([]);

            str = StringHelper.dirPathToArray("");
            expect(str).toEqual([]);

            str = StringHelper.dirPathToArray("foo/bar");
            expect(str).toEqual(["foo", "bar"]);

            str = StringHelper.dirPathToArray("./bar/baz");
            expect(str).toEqual(["bar", "baz"]);

            str = StringHelper.dirPathToArray("./bar/baz/good-file.ts");
            expect(str).toEqual(["bar", "baz", "good-file.ts"]);
        });

    });

});
