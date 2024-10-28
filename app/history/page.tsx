'use client';

import React, { useEffect, useState } from 'react';
import {
  IconDownload,
  IconFilter,
  IconSearch,
  IconStar,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Container,
  Group,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import CustomHeader from '@/components/CustomHeader/CustomHeader';

const TranslationHistory = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('translationHistory') || '[]');
    setHistory(storedHistory);
    setFilteredHistory(storedHistory);
  }, []);

  const saveHistoryToLocalStorage = (updatedHistory) => {
    setHistory(updatedHistory);
    setFilteredHistory(updatedHistory);
    localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
  };

  // Поиск по ключевым словам
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = history.filter((entry) =>
      entry.input.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredHistory(filtered);
  };

  // Сортировка переводов
  const handleSort = (order) => {
    setSortOrder(order);
    const sorted = [...filteredHistory].sort((a, b) => {
      if (order === 'newest') return new Date(b.date) - new Date(a.date);
      if (order === 'oldest') return new Date(a.date) - new Date(b.date);
      if (order === 'alphabetical') return a.input.localeCompare(b.input);
      return 0;
    });
    setFilteredHistory(sorted);
  };

  // Переключение избранного
  const toggleFavorite = (index) => {
    const updatedHistory = [...history];
    updatedHistory[index].favorite = !updatedHistory[index].favorite;
    saveHistoryToLocalStorage(updatedHistory);
  };

  // Фильтрация избранных переводов
  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    if (showFavorites) {
      setFilteredHistory(history.filter((entry) => entry.favorite));
    } else {
      setFilteredHistory(history);
    }
  };

  // Удаление одного перевода
  const handleDelete = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    saveHistoryToLocalStorage(updatedHistory);
  };

  // Очистка всей истории
  const clearHistory = () => {
    localStorage.removeItem('translationHistory');
    setHistory([]);
    setFilteredHistory([]);
  };

  // Экспорт в JSON
  const exportToJson = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredHistory)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'translationHistory.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const renderTranslation = (translation) => {
    if (typeof translation === 'string') {
      return translation;
    }

    if (typeof translation === 'object') {
      return Object.keys(translation).map((sourceKey) => (
        <div key={sourceKey} style={{ marginBottom: '15px' }}>
          <Text
            size="sm"
            weight={600}
            style={{
              color: isDark ? '#74b9ff' : '#3498db',
              marginBottom: '5px',
              textTransform: 'capitalize',
            }}
          >
            {sourceKey.replace(/_/g, ' ')}:
          </Text>
          {translation[sourceKey].map((item, index) => (
            <Group
              key={index}
              direction="column"
              spacing="xs"
              style={{
                paddingLeft: '15px',
                borderLeft: `2px solid ${isDark ? '#74b9ff' : '#3498db'}`,
                marginBottom: '10px',
              }}
            >
              <Text
                size="sm"
                weight={600}
                style={{
                  color: isDark ? '#ecf0f1' : '#34495e',
                  marginBottom: '5px',
                }}
              >
                Слово: {item.word || item.word1}
              </Text>
              <Text
                size="sm"
                style={{
                  whiteSpace: 'pre-wrap',
                  color: isDark ? '#b2bec3' : '#2c3e50',
                }}
              >
                <strong>Перевод:</strong>{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: item.translate || 'Перевод отсутствует',
                  }}
                />
              </Text>
            </Group>
          ))}
        </div>
      ));
    }

    return 'Перевод отсутствует';
  };

  return (
    <>
      <CustomHeader />
      <Container size="sm" style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <Paper
          radius="lg"
          p="lg"
          style={{
            width: '100%',
            maxWidth: 600,
            color: isDark ? '#ecf0f1' : '#34495e',
          }}
        >
          <Title
            order={1}
            align="center"
            style={{
              fontSize: '24px',
              marginBottom: '20px',
              color: isDark ? '#ffffff' : '#2c3e50',
            }}
          >
            История переводов
          </Title>

          {/* Панель поиска и фильтрации */}
          <Group spacing="md" mb="lg">
            <TextInput
              placeholder="Поиск перевода..."
              icon={<IconSearch size={18} />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '100%' }}
            />
            <Select
              data={[
                { value: 'newest', label: 'Новые' },
                { value: 'oldest', label: 'Старые' },
                { value: 'alphabetical', label: 'А-Я' },
              ]}
              value={sortOrder}
              onChange={handleSort}
              icon={<IconFilter size={18} />}
              placeholder="Сортировка"
            />
          </Group>

          <Group position="center" mb="lg">
            <Button onClick={toggleShowFavorites} color="yellow">
              {showFavorites ? 'Все' : 'Избранное'}
            </Button>
            <Button color="red" variant="outline" onClick={clearHistory} leftIcon={<IconTrash />}>
              Очистить историю
            </Button>
            <Button
              color="blue"
              variant="outline"
              onClick={exportToJson}
              leftIcon={<IconDownload />}
            >
              Экспорт в JSON
            </Button>
          </Group>

          {filteredHistory.length > 0 ? (
            filteredHistory.map((entry, index) => (
              <Paper
                key={index}
                p="30"
                mt="xs"
                radius="14"
                style={{
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: isDark ? '#3a3a3c' : '#f8f9fa',
                }}
              >
                <Group direction="column" spacing="xs">
                  <Text
                    size="sm"
                    weight={500}
                    style={{
                      color: isDark ? '#dfe6e9' : '#2c3e50',
                    }}
                  >
                    Ввод: {entry.input}
                  </Text>
                  <Text
                    size="sm"
                    style={{
                      whiteSpace: 'pre-wrap',
                      color: isDark ? '#b2bec3' : '#2c3e50',
                      marginTop: '10px',
                    }}
                  >
                    Перевод:
                    {renderTranslation(entry.output)}
                  </Text>
                  <Group position="right" spacing="xs">
                    <Tooltip label="Удалить">
                      <ActionIcon onClick={() => handleDelete(index)} color="red" variant="outline">
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Избранное">
                      <ActionIcon
                        onClick={() => toggleFavorite(index)}
                        color="yellow"
                        variant="outline"
                      >
                        {entry.favorite ? <IconStarFilled size={18} /> : <IconStar size={18} />}
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Paper>
            ))
          ) : (
            <Text color="dimmed" align="center">
              История пуста
            </Text>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default TranslationHistory;
