import Endpoint from "./Endpoint"
import TestHelper from "./TestHelper"

describe(Endpoint.name, () => {
    const rowsAffected = TestHelper.randomInt()
    const response = "response"
    const name = "name"
    const version = TestHelper.randomInt()
    const parameters = "parameters"
    class AllActions extends Endpoint {
        private setup(): void {
            this.rowsAffected = rowsAffected
            this.response = response
        }
        protected async delete(): Promise<void> {
            await this.setup()
        }
        protected async get(): Promise<void> {
            await this.setup()
        }
        protected async post(): Promise<void> {
            await this.setup()
        }
    }
    class NoActions extends Endpoint {}
    class TestDefaultResponse extends Endpoint {
        // eslint-disable-next-line no-empty-function
        protected async get(): Promise<void> {}
    }

    describe.each([
        ["delete", Endpoint.StatusCode.noContent],
        ["get", Endpoint.StatusCode.ok],
        ["post", Endpoint.StatusCode.created],
    ])("%s", (action: string, statusCode: number) => {
        test("with actions defined", async () => {
            const endpoint = new AllActions(name, version, action, parameters)

            await endpoint.init()

            expect(endpoint.getName()).toBe(name)
            expect(endpoint.getStatusCode()).toBe(statusCode)
            expect(endpoint.getRowsAffected()).toBe(rowsAffected)
            expect(endpoint.getResponse()).toBe(response)
        })

        test("without actions defined", async () => {
            const endpoint = new NoActions(name, version, action, parameters)

            await endpoint.init()

            expect(endpoint.getName()).toBe(name)
            expect(endpoint.getStatusCode()).toBe(
                Endpoint.StatusCode.badRequest
            )
            expect(endpoint.getRowsAffected()).toBe(0)
            expect(endpoint.getResponse()).toBe("{}")
        })
    })

    test("invalid action", async () => {
        const endpoint = new AllActions(
            name,
            version,
            "invalid action",
            parameters
        )

        await endpoint.init()

        expect(endpoint.getName()).toBe(name)
        expect(endpoint.getStatusCode()).toBe(Endpoint.StatusCode.badRequest)
        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe("{}")
    })

    test("default response", async () => {
        const endpoint = new TestDefaultResponse(
            name,
            version,
            "get",
            parameters
        )

        await endpoint.init()

        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe("{}")
    })
})
