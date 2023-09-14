var state = {
    ticker: false,
    hvac: "off",
    cabinsetpoint: 0,
    cabintemp: 0,
    cooling: false,
    heating: false,
    cp: false,
    ctype: ""
}

function sync()
{
    hvac = OvmsMetrics.Value("v.e.hvac")
    cabinsetpoint = OvmsMetrics.Value("v.e.cabinsetpoint")
    cabintemp = OvmsMetrics.Value("v.e.cabintemp")
    cooling = OvmsMetrics.Value("v.e.cooling")
    heating = OvmsMetrics.Value("v.e.heating")
    cp = OvmsMetrics.Value("v.d.cp")
    ctype = OvmsMetrics.Value("v.c.type")

    if (hvac != state.hvac)
        OvmsEvents.Raise(hvac ? "climatecontrol.on" : "climatecontrol.off")
    if (cabinsetpoint != state.cabinsetpoint)
        OvmsEvents.Raise("climatecontrol.cabinsetpoint." + cabinsetpoint)
    if (cabintemp != state.cabintemp)
        OvmsEvents.Raise("climatecontrol.cabintemp." + cabintemp)
    if (state.cooling != cooling && cooling)
        OvmsEvents.Raise("climatecontrol.cooling")
    if (state.heating != heating && heating)
        OvmsEvents.Raise("climatecontrol.heating")
    if (state.cp != cp)
        OvmsEvents.Raise(cp ? "charger.connected" : "charger.disconnected")
    if (state.ctype != ctype)
        if (ctype == "chademo")
            OvmsEvents.Raise("charger.quickchargestarted")
        else if (state.ctype == "chademo")
            OvmsEvents.Raise("charger.quickchargestopped")

    state.hvac = hvac
    state.cabinsetpoint = cabinsetpoint
    state.cabintemp = cabintemp
    state.cooling = cooling
    state.heating = heating
    state.cp = cp
    state.ctype = ctype
    //print(JSON.format(state))
}

function init()
{
    state.ticker = PubSub.subscribe("ticker.1", sync)
    state.hvac = OvmsMetrics.Value("v.e.hvac")
    state.cabinsetpoint = OvmsMetrics.Value("v.e.cabinsetpoint")
    state.cabintemp = OvmsMetrics.Value("v.e.cabintemp")
    state.cooling = OvmsMetrics.Value("v.e.cooling")
    state.heating = OvmsMetrics.Value("v.e.heating")
    state.cp = OvmsMetrics.Value("v.d.cp")
    state.ctype = OvmsMetrics.Value("v.c.type")
}

init()
