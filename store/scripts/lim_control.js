var state = {
   limstate: false,
   prepareshuttingdown: 0,
   ticker: false
}

function prepareshutdown()
{
    if (state.prepareshutdown)
        return
    OvmsEvents.Raise("limcontrol.prepareshutdown")
    state.prepareshuttingdown = performance.now()
}

function cancelshutdown()
{
    if (state.prepareshuttingdown == 0)
        return
    OvmsEvents.Raise("limcontrol.cancelshutdown")
    state.prepareshuttingdown = 0
}

function startup()
{
    cancelshutdown()
    if (state.limstate)
        return
    state.limstate = true
    OvmsCommand.Exec("egpio output 5 0")
    OvmsEvents.Raise("limcontrol.on")
    state.prepareshuttingdown = 0
}

function shutdown()
{
    if (!state.limstate)
        return
    state.limstate = false
    OvmsCommand.Exec("egpio output 5 1")
    OvmsEvents.Raise("limcontrol.off")
    state.prepareshuttingdown = 0
}

function maybeshutdown()
{
    if (state.prepareshuttingdown == 0)
        return
    if (performance.now() - state.prepareshuttingdown > 15 * 60 * 1000)
        shutdown()
}

function init()
{
    PubSub.subscribe("egpio.output.5.low", function(){
        state.limstate = true
        print(JSON.format(state))
    })
    PubSub.subscribe("egpio.output.5.high", function(){
        state.limstate = false
        state.prepareshuttingdown = 0
        print(JSON.format(state))
    })
    PubSub.subscribe("vehicle.on", startup)
    PubSub.subscribe("vehicle.charge.start", startup)
    PubSub.subscribe("vehicle.gear.forward", startup)
    PubSub.subscribe("vehicle.gear.reverse", startup)
    PubSub.subscribe("vehicle.off", prepareshutdown)
    PubSub.subscribe("vehicle.charge.stop", prepareshutdown)

    input = eval(OvmsMetrics.AsJSON("m.egpio.input"))
    state.limstate = input.indexOf(5) < 0
    state.ticker = PubSub.subscribe("ticker.10", maybeshutdown)
}

init()
