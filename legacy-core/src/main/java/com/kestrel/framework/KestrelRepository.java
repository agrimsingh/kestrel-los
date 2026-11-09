package com.kestrel.framework;

import java.util.HashMap;
import java.util.Map;

public final class KestrelRepository {
  private static final Map<String, String> LOAN_STATE = new HashMap<>();

  private KestrelRepository() {}

  public static void save(String loanId, String stateKey, String stateValue) {
    LOAN_STATE.put(loanId + ":" + stateKey, stateValue);
  }

  public static String get(String loanId, String stateKey) {
    return LOAN_STATE.get(loanId + ":" + stateKey);
  }

  public static void clear() {
    LOAN_STATE.clear();
  }
}
