package ru.job4j.todo.store;

import ru.job4j.todo.model.Item;

import java.util.List;

public interface Store {
    Item addItem(Item item);
    boolean updateItem(Item item);
    boolean delete(int id);
    List<Item> findAll();
    List<Item> findByStatus(boolean done);
    Item findById(int id);
}
