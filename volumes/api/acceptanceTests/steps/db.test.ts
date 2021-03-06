import { Then, When } from "cucumber"
import Endpoint from "../../src/Endpoint"
import Srvr from "../../src/Srvr"
import expect from "expect"

let endpoint: Endpoint

When("the API attempts to connect to postgres", async () => {
    const srvr = new Srvr()
    endpoint = await srvr.createEndpoint("get", "TestPostgres")
})

Then("the postgres connection is successful", () => {
    console.log(endpoint)
    expect(endpoint.getResponse()).toBe(JSON.stringify({ postgres: true }))
})
