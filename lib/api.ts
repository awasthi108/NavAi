export type TimeSeriesInput =
  | number[]
  | {
      values: number[];
      horizon?: number;
    };

export type TimeSeriesPredictionResponse = {
  predictions: number[];
  rmse: number;
  mae: number;
};

const DEFAULT_FORECAST_HORIZON = 7;

function normalizeInput(inputData: TimeSeriesInput) {
  if (Array.isArray(inputData)) {
    return {
      values: inputData,
      horizon: DEFAULT_FORECAST_HORIZON,
    };
  }

  return {
    values: inputData.values,
    horizon: inputData.horizon ?? DEFAULT_FORECAST_HORIZON,
  };
}

function roundMetric(value: number) {
  return Number(value.toFixed(4));
}

function calculateErrorMetrics(values: number[]) {
  if (values.length < 2) {
    return {
      rmse: 0,
      mae: 0,
    };
  }

  const errors = values.slice(1).map((actual, index) => {
    const predicted = values[index];
    return actual - predicted;
  });

  const absoluteErrors = errors.map((error) => Math.abs(error));
  const squaredErrors = errors.map((error) => error ** 2);

  const mae =
    absoluteErrors.reduce((total, error) => total + error, 0) /
    absoluteErrors.length;
  const rmse = Math.sqrt(
    squaredErrors.reduce((total, error) => total + error, 0) /
      squaredErrors.length,
  );

  return {
    rmse: roundMetric(rmse),
    mae: roundMetric(mae),
  };
}

function simulateForecast(values: number[], horizon: number) {
  if (values.length === 0 || horizon <= 0) {
    return [];
  }

  if (values.length === 1) {
    return Array.from({ length: horizon }, () => roundMetric(values[0]));
  }

  const recentWindow = values.slice(-Math.min(values.length, 6));
  const averageStep =
    recentWindow.slice(1).reduce((total, value, index) => {
      return total + (value - recentWindow[index]);
    }, 0) / Math.max(recentWindow.length - 1, 1);

  const recentAverage =
    recentWindow.reduce((total, value) => total + value, 0) /
    recentWindow.length;
  const lastValue = values[values.length - 1];
  const momentum = (lastValue - recentAverage) * 0.15;

  return Array.from({ length: horizon }, (_, index) => {
    const step = index + 1;
    return roundMetric(lastValue + averageStep * step + momentum);
  });
}

export async function predictTimeSeries(
  inputData: TimeSeriesInput,
): Promise<TimeSeriesPredictionResponse> {
  const { values, horizon } = normalizeInput(inputData);

  // Replace this block with a POST to the FastAPI prediction endpoint later.
  const predictions = simulateForecast(values, horizon);
  const { rmse, mae } = calculateErrorMetrics(values);

  return {
    predictions,
    rmse,
    mae,
  };
}
