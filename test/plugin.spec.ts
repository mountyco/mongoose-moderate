process.env.MONGOOSE_WAYBACK_CONNECTION_URL = "mongodb://localhost:27017/wayback-test-audits";
import { Schema, model, Document, Model, connect } from "mongoose";
import { NeedsModeration } from "../src/interfaces/needsModeration";


import WaybackPlugin from "../src/";
import { PendingApprovalError } from "../src/core/errors";

connect("mongodb://localhost:27017/wayback-test");








const TestSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
}, { timestamps: true });


interface InterfaceTeamSchema extends Document, NeedsModeration {
    name: string;
    email: string;
}


TestSchema.plugin(WaybackPlugin);
const Test: Model<InterfaceTeamSchema> = model("UserTest", TestSchema as unknown as Schema<InterfaceTeamSchema>);

// Test.updateOne({
//     name: "Anand Sid",
// }, { email: "anand@mounty.co" }, null, (err) => {
//     console.log(err);
// });

Test.findOne({ email: "anand@mounty.co" }, (e: unknown, data: InterfaceTeamSchema) => {
    data.__user = { name: "Hello World", _id: "Hello" };
    data.name = "Anand Siddharth Xyz X Sd";
    data.save().then(console.log).catch((e) => {
        console.log(e.name)
    });
});
// Test.updateMany({
//     email: "anand@mounty.co"
// }, { name: "Kane", __user: { name: "anand siddharth" } }).then(() => console.log("sd"));

// var t = new Test();
// t.email = "Akhil Marsonya";
// t.name = "akhil@mounty.co";
// t.__user = { name: "anand siddharth" };
// t.save();
