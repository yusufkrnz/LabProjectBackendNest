import { Injectable } from '@nestjs/common';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private httpRequestDuration: Histogram<string>;
  private httpRequestTotal: Counter<string>;
  private activeConnections: Gauge<string>;
  private memoryUsage: Gauge<string>;

  constructor() {
    // Default metrics'i topla (CPU, memory, etc.)
    collectDefaultMetrics({ register });

    // HTTP request duration histogram
    this.httpRequestDuration = new Histogram({
      name: 'nestjs_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    });

    // HTTP request counter
    this.httpRequestTotal = new Counter({
      name: 'nestjs_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    // Active connections gauge
    this.activeConnections = new Gauge({
      name: 'nestjs_active_connections',
      help: 'Number of active connections',
    });

    // Memory usage gauge
    this.memoryUsage = new Gauge({
      name: 'nestjs_memory_usage_bytes',
      help: 'Memory usage in bytes',
      labelNames: ['type'],
    });

    // Register custom metrics
    register.registerMetric(this.httpRequestDuration);
    register.registerMetric(this.httpRequestTotal);
    register.registerMetric(this.activeConnections);
    register.registerMetric(this.memoryUsage);

    // Update memory usage periodically
    this.updateMemoryUsage();
    setInterval(() => this.updateMemoryUsage(), 5000);
  }

  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestTotal.inc({ method, route, status_code: statusCode.toString() });
    this.httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  private updateMemoryUsage() {
    const memUsage = process.memoryUsage();
    this.memoryUsage.set({ type: 'rss' }, memUsage.rss);
    this.memoryUsage.set({ type: 'heapTotal' }, memUsage.heapTotal);
    this.memoryUsage.set({ type: 'heapUsed' }, memUsage.heapUsed);
    this.memoryUsage.set({ type: 'external' }, memUsage.external);
  }

  getMetrics(): Promise<string> {
    return register.metrics();
  }
}
