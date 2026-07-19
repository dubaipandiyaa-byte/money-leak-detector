package com.donrithik.moneyleakdetector;

import android.os.CancellationSignal;

import androidx.credentials.CredentialManager;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.exceptions.GetCredentialException;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.libraries.identity.googleid.GetGoogleIdOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;

import java.util.concurrent.Executors;

/**
 * Native Google Sign-In for the remote-URL web app.
 *
 * Google blocks its OAuth pages inside embedded WebViews
 * (disallowed_useragent), so the web app cannot use the browser redirect
 * flow when running inside this shell. Instead the web code calls
 * window.Capacitor.Plugins.GoogleAuth.signIn(), this plugin obtains a
 * Google ID token natively via Credential Manager, and the web code
 * exchanges it with supabase.auth.signInWithIdToken().
 *
 * The server client id (R.string.google_web_client_id) must be the WEB
 * OAuth client id — the same one configured for the Google provider in
 * Supabase — so the token's audience matches what Supabase accepts.
 */
@CapacitorPlugin(name = "GoogleAuth")
public class GoogleAuthPlugin extends Plugin {

    @com.getcapacitor.PluginMethod
    public void signIn(PluginCall call) {
        String serverClientId = getContext().getString(R.string.google_web_client_id);
        if (serverClientId == null || serverClientId.isEmpty()) {
            call.reject("google_web_client_id is not configured");
            return;
        }

        GetGoogleIdOption googleIdOption = new GetGoogleIdOption.Builder()
            .setFilterByAuthorizedAccounts(false)
            .setServerClientId(serverClientId)
            .build();

        GetCredentialRequest request = new GetCredentialRequest.Builder()
            .addCredentialOption(googleIdOption)
            .build();

        CredentialManager credentialManager = CredentialManager.create(getContext());
        credentialManager.getCredentialAsync(
            getActivity(),
            request,
            new CancellationSignal(),
            Executors.newSingleThreadExecutor(),
            new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                @Override
                public void onResult(GetCredentialResponse response) {
                    androidx.credentials.Credential credential = response.getCredential();
                    if (credential instanceof CustomCredential
                        && GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL
                            .equals(credential.getType())) {
                        GoogleIdTokenCredential tokenCredential =
                            GoogleIdTokenCredential.createFrom(
                                ((CustomCredential) credential).getData());
                        JSObject result = new JSObject();
                        result.put("idToken", tokenCredential.getIdToken());
                        result.put("email", tokenCredential.getId());
                        result.put("displayName", tokenCredential.getDisplayName());
                        call.resolve(result);
                    } else {
                        call.reject("Unexpected credential type");
                    }
                }

                @Override
                public void onError(GetCredentialException e) {
                    call.reject(e.getMessage() != null ? e.getMessage() : "Sign-in failed", e);
                }
            });
    }
}
