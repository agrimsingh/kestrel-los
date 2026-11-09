package com.kestrel.framework;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public enum AuditTrail {
  INSTANCE;

  private final List<String> events = new ArrayList<>();

  public void append(String correlationId, String eventType, String loanId, String detail) {
    events.add(correlationId + "|" + eventType + "|" + loanId + "|" + detail);
  }

  public List<String> events() {
    return Collections.unmodifiableList(events);
  }

  public void clear() {
    events.clear();
  }
}
