package ru.job4j.todo.store;

import ru.job4j.todo.model.Category;
import ru.job4j.todo.model.Item;
import ru.job4j.todo.model.User;

import java.util.List;

public interface Store {
    Item addItem(Item item);
    boolean updateItem(Item item);
    boolean delete(int id);
    List<Item> findAll(int userId);
    Item findById(int id);
    User findUserByEmail(String email);
    User saveUser(User user);
    List<Category> findAllCategories();
    Category findCategoryById(int id);
}
