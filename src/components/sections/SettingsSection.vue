<template>
  <section class="section">
    <div class="section__title">Настройки</div>
    <div class="settings-content">
      <div class="form-group">
        <div class="form-group__title">Город:</div>
        <select
            class="select"
            v-model="settings.location"
            @change="onSelectChange"
        >
          <option value="nazran">Назрань</option>
          <option value="dubai">Дубай</option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup>
import useSettings from '../../composables/useSettings.js'
import { useSchedule } from '../../composables/useSchedule.js'

const { settings } = useSettings()

const onSelectChange = async () => {
  const {loadSchedule} = useSchedule()
  await loadSchedule()
}
</script>

<style lang="scss">
.form-group {
  display: block;

  &__title {
    margin-bottom: 12px;
    font-weight: 500;
    font-size: 14px;
    color: #727088;
  }

  &:not(:last-child) {
    margin-bottom: 16px;
  }
}

.settings-content {
  padding: 16px 16px 32px;
}

.select {
  width: 100%;
  padding: 12px 8px;
  border: 1px solid #727088;
  font-weight: 500;
}
</style>