package com.donrithik.moneyleakdetector;

import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.widget.ImageView;

import androidx.activity.OnBackPressedCallback;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Native Google Sign-In bridge — must be registered before
        // super.onCreate() so Capacitor exposes it to the web app.
        registerPlugin(GoogleAuthPlugin.class);

        super.onCreate(savedInstanceState);

        // Brand splash: the Android 12+ system splash can only show an icon,
        // so a full-screen overlay presents the guardians artwork
        // (drawable/splash) while the remote web app loads underneath.
        // Plain timers only — splash-exit listeners (androidx or framework)
        // never fire under Capacitor's theme switch and would hold the
        // system splash forever. The overlay stays until the page has
        // loaded and a minimum brand time has passed, with a hard cap so a
        // dead connection can never trap the user (the offline fallback
        // page sits behind it).
        final ImageView brandSplash = new ImageView(this);
        brandSplash.setImageResource(R.drawable.splash);
        brandSplash.setScaleType(ImageView.ScaleType.FIT_CENTER);
        brandSplash.setBackgroundColor(Color.parseColor("#0A0C10"));
        addContentView(brandSplash, new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT));

        final Handler handler = new Handler(Looper.getMainLooper());
        final long startedAt = SystemClock.uptimeMillis();
        final Runnable dismissWhenReady = new Runnable() {
            @Override
            public void run() {
                long elapsed = SystemClock.uptimeMillis() - startedAt;
                boolean pageReady = bridge != null
                    && bridge.getWebView() != null
                    && bridge.getWebView().getProgress() >= 100;
                if ((pageReady && elapsed >= 5500) || elapsed >= 9000) {
                    brandSplash.animate().alpha(0f).setDuration(500).withEndAction(() -> {
                        ViewGroup parent = (ViewGroup) brandSplash.getParent();
                        if (parent != null) parent.removeView(brandSplash);
                    });
                } else {
                    handler.postDelayed(this, 250);
                }
            }
        };
        handler.postDelayed(dismissWhenReady, 1000);

        // Allow muted autoplay for the AI-scan loading video — WebView
        // otherwise requires a user gesture before any media playback.
        bridge.getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false);

        // Android back button: navigate the WebView's history (the web
        // app's page stack). At the history root, minimize the app to the
        // background instead of destroying it, so the session and any
        // in-progress state survive.
        getOnBackPressedDispatcher()
            .addCallback(this, new OnBackPressedCallback(true) {
                @Override
                public void handleOnBackPressed() {
                    if (bridge != null && bridge.getWebView().canGoBack()) {
                        bridge.getWebView().goBack();
                    } else {
                        moveTaskToBack(true);
                    }
                }
            });
    }

    // CookieManager persists cookies to disk asynchronously; if the OS kills
    // the process before the write lands, the Supabase auth session is lost.
    // Force a flush whenever the app leaves the foreground.
    @Override
    public void onPause() {
        super.onPause();
        CookieManager.getInstance().flush();
    }
}
