package ir.zabanyar.app

import android.util.Log
import androidx.activity.ComponentActivity
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import ir.cafebazaar.poolakey.Connection
import ir.cafebazaar.poolakey.ConnectionState
import ir.cafebazaar.poolakey.Payment
import ir.cafebazaar.poolakey.config.PaymentConfiguration
import ir.cafebazaar.poolakey.config.SecurityCheck
import ir.cafebazaar.poolakey.request.PurchaseRequest

/**
 * Café Bazaar in-app billing (Poolakey) exposed to the web layer as `Billing`.
 *
 * The RSA public key comes from the Bazaar developer panel and is injected at
 * build time (`-PzabanyarRsaKey=...` -> BuildConfig.ZABANYAR_RSA_KEY). With an
 * empty key the plugin reports `billing_unavailable`, so the web app keeps
 * working as a free app instead of offering a broken purchase button.
 */
@CapacitorPlugin(name = "Billing")
class BillingPlugin : Plugin() {

    private companion object {
        const val TAG = "ZabanyarBilling"
    }

    private var payment: Payment? = null
    private var connection: Connection? = null

    override fun load() {
        val key = BuildConfig.ZABANYAR_RSA_KEY
        if (key.isBlank()) {
            Log.w(TAG, "no RSA key configured; billing stays disabled")
            return
        }
        val config = PaymentConfiguration(localSecurityCheck = SecurityCheck.Enable(rsaPublicKey = key))
        val instance = Payment(context = context, config = config)
        payment = instance
        connection = instance.connect {
            connectionSucceed { Log.i(TAG, "connected") }
            connectionFailed { Log.e(TAG, "connection failed") }
            disconnected { Log.i(TAG, "disconnected") }
        }
    }

    private fun ready(): Payment? {
        val instance = payment ?: return null
        return if (connection?.getState() == ConnectionState.Connected) instance else null
    }

    @PluginMethod
    fun available(call: PluginCall) {
        val result = JSObject()
        result.put("available", ready() != null)
        call.resolve(result)
    }

    @PluginMethod
    fun buy(call: PluginCall) {
        val instance = ready()
        if (instance == null) {
            call.reject("billing_unavailable")
            return
        }
        val sku = call.getString("sku")
        if (sku.isNullOrBlank()) {
            call.reject("missing_sku")
            return
        }

        val activity = activity as? ComponentActivity
        if (activity == null) {
            call.reject("billing_unavailable")
            return
        }

        val request = PurchaseRequest(productId = sku, payload = call.getString("payload") ?: "")
        val subscription = call.getString("type", "subs") != "inapp"

        val callback: ir.cafebazaar.poolakey.callback.PurchaseCallback.() -> Unit = {
            purchaseFlowBegan { Log.i(TAG, "flow began for $sku") }
            purchaseSucceed { entity ->
                val payload = JSObject()
                payload.put("productId", entity.productId)
                payload.put("token", entity.purchaseToken)
                call.resolve(payload)
            }
            purchaseCanceled { call.reject("canceled") }
            purchaseFailed { call.reject("failed") }
            failedToBeginFlow { call.reject("failed_to_begin") }
        }

        if (subscription) {
            instance.subscribeProduct(registry = activity.activityResultRegistry, request = request, callback = callback)
        } else {
            instance.purchaseProduct(registry = activity.activityResultRegistry, request = request, callback = callback)
        }
    }

    /** restores an existing subscription after a reinstall */
    @PluginMethod
    fun restore(call: PluginCall) {
        val instance = ready()
        if (instance == null) {
            call.reject("billing_unavailable")
            return
        }

        instance.getSubscribedProducts {
            querySucceed { items ->
                val result = JSObject()
                val skus = com.getcapacitor.JSArray()
                items.forEach { skus.put(it.productId) }
                result.put("productIds", skus)
                call.resolve(result)
            }
            queryFailed { call.reject("query_failed") }
        }
    }

    override fun handleOnDestroy() {
        connection?.disconnect()
        connection = null
        payment = null
        super.handleOnDestroy()
    }
}
