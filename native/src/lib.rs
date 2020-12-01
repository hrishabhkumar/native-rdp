use neon::prelude::*;
use neon::register_module;

mod mstsc;

pub use mstsc::Server;
pub use mstsc::start_rdp;

struct BackgroundTask {
    server: Server
}

impl Task for BackgroundTask {
    // If the computation does not error, it will return an i32.
    // Otherwise, it will return a String as an error
    type Output = i32;
    type Error = String;
    type JsEvent = JsNumber;

    // Perform expensive computation here. What runs in here
    // will not block the main thread. Will run in a background
    // thread
    fn perform(&self) -> Result<i32, String> {
        // Downcast `this` so .set can be called on it
        start_rdp(&self.server);
        // Equivalent to  `this.modified = true` in JS
        // this.set(&mut cx, "modified", t)?;
        Ok(0)
    }

    // When perform() is finished running, complete() will convert
    // the result of the task to a JS value. In this case we are
    // converting a Rust i32 to a JsUndefined. This value will be passed
    // to the callback. perform() is executed on the main thread at
    // some point after the background task is completed.
    fn complete(self, mut cx: TaskContext, result: Result<i32, String>) -> JsResult<JsNumber> {
        Ok(cx.number(result.unwrap()))
    }
}

pub fn perform_async_task(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    // Take a function as an argument. This function should have the following
    // siguature: `function callback(err, value) {}`. The JS value returned from
    // complete() is passed as the `value` and the error message "This will fail"
    // is passed as the `err`
    let server_js = cx.argument::<JsValue>(0)?;

    let server :Server = neon_serde::from_value(&mut cx, server_js)?;
    let f = cx.argument::<JsFunction>(1)?;
    let task = BackgroundTask { server: server };
    task.schedule(f);
    Ok(cx.undefined())
}

register_module!(mut cx, {
    cx.export_function("startRdp", perform_async_task);
    Ok(())
});