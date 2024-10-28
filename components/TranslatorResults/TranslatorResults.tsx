import React, { useEffect, useState } from 'react';
import { IconBookmark, IconCopy } from '@tabler/icons-react';
import {
  ActionIcon,
  Card,
  Container,
  Group,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';

// Функция для приведения названия источников к читаемому виду
const sourceTitles = {
  maciev_ce_ru: 'Макеев (Чеченский-Русский)',
  ismailov_ce_ru: 'Исмаилов (Чеченский-Русский)',
  karasaev_maciev_ru_ce: 'Карасаев-Макеев (Русский-Чеченский)',
};

// Функция копирования текста в буфер обмена
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

const TranslatorResults = ({ data }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [savedWords, setSavedWords] = useState([]);

  // Загружаем сохранённые слова из localStorage при загрузке компонента
  useEffect(() => {
    const storedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
    setSavedWords(storedWords);
  }, []);

  // Сохраняем слова в localStorage и в состоянии
  const saveWord = (word, translation) => {
    const newSavedWord = { word, translation };
    const updatedSavedWords = [...savedWords, newSavedWord];
    setSavedWords(updatedSavedWords);
    localStorage.setItem('savedWords', JSON.stringify(updatedSavedWords));
  };

  if (!data) return null;

  return (
    <Container size="md" style={{ padding: '30px' }}>
      <Title
        order={2}
        align="center"
        mb="lg"
        style={{
          fontWeight: 700,
          color: isDark ? '#ecf0f1' : '#2c3e50',
        }}
      >
        Результаты перевода
      </Title>

      {/* Обработка данных для каждого источника */}
      {Object.keys(data).map((sourceKey) => (
        <div key={sourceKey} style={{ marginBottom: '40px' }}>
          <Title
            order={3}
            mb="sm"
            align="left"
            style={{
              color: isDark ? '#74b9ff' : '#3498db',
            }}
          >
            {sourceTitles[sourceKey] || sourceKey}
          </Title>

          {/* Карточки для слов и переводов */}
          <Group direction="column" spacing="md" style={{ alignItems: 'stretch' }}>
            {data[sourceKey].map((item) => (
              <Card
                shadow="md"
                padding="lg"
                radius="md"
                key={item.word || item.word1}
                style={{
                  position: 'relative',
                  backgroundColor: isDark ? '#2c3e50' : '#fff',
                  color: isDark ? '#ecf0f1' : '#34495e',
                }}
              >
                <Group position="apart" mb="xs">
                  <Text
                    weight={600}
                    size="lg"
                    style={{
                      color: isDark ? '#dfe6e9' : '#34495e',
                    }}
                  >
                    {item.word || item.word1}
                  </Text>

                  {/* Кнопки копирования и сохранения перевода */}
                  <Group spacing="xs">
                    <Tooltip label="Копировать перевод" withArrow>
                      <ActionIcon
                        onClick={() => copyToClipboard(item.translate)}
                        color={isDark ? 'indigo' : 'blue'}
                        variant="light"
                      >
                        <IconCopy size={18} />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Сохранить перевод" withArrow>
                      <ActionIcon
                        onClick={() => saveWord(item.word || item.word1, item.translate)}
                        color={isDark ? 'yellow' : 'orange'}
                        variant="light"
                      >
                        <IconBookmark size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                <Text
                  size="sm"
                  color="dimmed"
                  style={{
                    whiteSpace: 'pre-wrap',
                    color: isDark ? '#b2bec3' : 'dimmed',
                  }}
                >
                  <span
                    dangerouslySetInnerHTML={{ __html: item.translate || 'Перевод отсутствует' }}
                  />
                </Text>
              </Card>
            ))}
          </Group>
        </div>
      ))}

      {/* Сохранённые слова */}
    </Container>
  );
};

export default TranslatorResults;
