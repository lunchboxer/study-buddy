<script>
  export let words
  export let lexile

  const countWords = (words) => {
    let count = 0
    for (const word of words) {
      if (!word.startsWith('[insertion]')) {
        count++
      }
    }
    return count
  }

  const countErrors = (words) => {
    let errors = 0
    for (const word of words) {
      if (word.startsWith('[omission]')) {
        errors++
      }
      if (word.startsWith('[substitution]')) {
        errors++
      }
      if (word.startsWith('[repetition]')) {
        errors++
      }
      if (word.startsWith('[insertion]')) {
        errors++
      }
    }
    return errors
  }
  const countSelfCorrections = (words) => {
    let selfCorrections = 0
    for (const word of words) {
      if (word.startsWith('[self-correction]')) {
        selfCorrections++
      }
    }
    return selfCorrections
  }
  const getAccuracy = (words) =>
    Math.round(((countWords(words) - countErrors(words)) / countWords(words)) * 100)
  const getDetermination = (words) => {
    const accuracy = getAccuracy(words)
    if (accuracy > 96) {
      return 'Easy: Consider advancement'
    }
    if (accuracy > 93) {
      return 'Appropriate instructional text'
    }
    if (accuracy >= 90) {
      return 'Challenging: may need support'
    }
    return 'Difficult: consider lower level'
  }
</script>

<div class="stats flex mt-4">
  <div class="stat">
    <div class="stat-title">Total Words</div>
    <div class="stat-value">{countWords(words)}</div>
  </div>
  <div class="stat">
    <div class="stat-title">Errors</div>
    <div class="stat-value">{countErrors(words)}</div>
  </div>
  <div class="stat">
    <div class="stat-title">Self Corrections</div>
    <div class="stat-value">{countSelfCorrections(words)}</div>
  </div>
  <div class="stat">
    <!-- Running Words – Total Errors = Score -->
    <div class="stat-title">Score</div>
    <div class="stat-value">{countWords(words) - countErrors(words)}</div>
  </div>
  <div class="stat">
    <!-- Score / Running Words / 100 = % Accuracy -->
    <div class="stat-title">Accuracy</div>
    <div class="stat-value">
      {getAccuracy(words)}%
    </div>
  </div>
</div>

<dl>
  <dt>Lexile</dt>
  <dd>{lexile}L</dd>
  <dt>Determination</dt>
  <dd>{getDetermination(words)}</dd>
</dl>
