const config = {
    // base_url: "https://takotoko.com",
    base_url: "http://10.10.101.236:8000",
    dev: true,
    gkeys: [
        "AQ.Ab8RN6JvzjpigWyoHEyFaA9LakGSMr-N6Xi9LrPbZUi2x_hXew",
        "AIzaSyAUPmIOvA4QxJsw9F95K_UJUrhhw5zjDoc",
        "AQ.Ab8RN6Ie2wmn4YFlifgB0-jBuagZWY8kq1IR_wad0YJc5m_tsw",
        "AQ.Ab8RN6KEGuyPQLfogm-APKCmTOq0YlgDjFqFC7wd2ABQEpJGpg",
        "AQ.Ab8RN6KuIjB1jFUVM0ABipZnqR69DLiZF3yk5i6oAq6KXetY5Q",
        "AQ.Ab8RN6JdukmP2f1ctOHbOSQ_LCcWQSP9arGp_oPPYcRJgt0EVQ",
        "AQ.Ab8RN6LDxyVFsbh2uXQX4CiByU2fThcz13andFpS6PAUmb6YWA",
        "AIzaSyAvwobkf5EsawVxle8r5oJDdyfdZ800dKQ",
        "AIzaSyAyluBncft3wW5qs_W0QldM7tuQa2iOT_0",
        "AIzaSyClb2UdegMF7RNdoAJmRctyyN9b2UbRT7w",
        "AIzaSyCSeYrTpyh3G8quOPDhZtqpH6yr4WRsAFY",
        "AQ.Ab8RN6KFAoPJ5aoNQ7YGg_lreTzVzS7GrlbJ6qhStBDjxMEHRw",
    ],
    enums: {
        PAYMENT_STATUSES: [
            { key: null, label: "Semua", icon: "cash-outline" },
            { key: "PENDING", label: "Tertunda", icon: "cash-outline" },
            { key: "PAID", label: "Lunas", icon: "qr-code-outline" },
        ],
        PAYMENT_METHODS: [
            { key: null, label: "Semua", icon: "cash-outline" },
            { key: "CASH", label: "Tunai", icon: "cash-outline" },
            { key: "QRISC", label: "QRIS", icon: "qr-code-outline" },
        ]
    }
}

export default config;